package com.swadExpress.controller;

import com.swadExpress.config.JwtProvider;
import com.swadExpress.entity.Cart;
import com.swadExpress.entity.USER_ROLE;
import com.swadExpress.entity.User;
import com.swadExpress.entity.PendingRegistration;
import com.swadExpress.entity.PendingPasswordReset;
import com.swadExpress.repository.CartRepository;
import com.swadExpress.exception.ApiException;
import com.swadExpress.repository.PendingRegistrationRepository;
import com.swadExpress.repository.PendingPasswordResetRepository;
import com.swadExpress.repository.UserRepository;
import com.swadExpress.request.ForgotPasswordRequest;
import com.swadExpress.request.LoginRequest;
import com.swadExpress.request.VerifyRegistrationRequest;
import com.swadExpress.response.AuthResponse;
import com.swadExpress.service.EmailService;
import com.swadExpress.service.impl.CustomUserDetailsService;
import com.swadExpress.util.EmailTemplateBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.mail.MailSendException;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.Collection;
import java.util.Date;

@RestController
@RequestMapping("/auth")
public class AuthController{

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider  jwtProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private PendingRegistrationRepository pendingRegistrationRepository;

    @Autowired
    private PendingPasswordResetRepository pendingPasswordResetRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) {
        if (user == null || user.getEmail() == null || user.getEmail().isBlank()
                || user.getPassword() == null || user.getPassword().isBlank()
                || user.getFullName() == null || user.getFullName().isBlank()
                || user.getRole() == null) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Name, email, password, and role are required."
            );
        }

        String email = user.getEmail().trim().toLowerCase();
        if (userRepository.findByEmail(email) != null) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "This email address already exists. Please log in instead."
            );
        }

        PendingRegistration pending = pendingRegistrationRepository.findByEmail(email);
        if (pending == null) {
            pending = new PendingRegistration();
        }
        pending.setEmail(email);
        pending.setFullName(user.getFullName().trim());
        pending.setRole(user.getRole());
        pending.setEncodedPassword(passwordEncoder.encode(user.getPassword()));
        pending.setOtpExpiresAt(new Date(System.currentTimeMillis() + 5 * 60 * 1000L));

        String otp = generateOtp();
        pending.setEncodedOtp(passwordEncoder.encode(otp));
        pendingRegistrationRepository.save(pending);
        try {
            emailService.sendEmail(
                    pending.getEmail(),
                    "Verify your SwadExpress account",
                    EmailTemplateBuilder.otpEmail(
                            "Verify your SwadExpress account",
                            "Use the OTP below to verify your email and finish creating your account.",
                            otp,
                            pending.getFullName())
            );
        } catch (MailSendException exception) {
            pendingRegistrationRepository.delete(pending);
            throw new ApiException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "We couldn't send the verification email. Please try again later."
            );
        }

        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("OTP sent to your email");

        return new ResponseEntity<>(authResponse, HttpStatus.ACCEPTED);
    }

    @PostMapping("/verify-registration")
    public ResponseEntity<AuthResponse> verifyRegistration(
            @RequestBody VerifyRegistrationRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()
                || request.getOtp() == null || request.getOtp().isBlank()) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Email and verification code are required."
            );
        }

        PendingRegistration pending = pendingRegistrationRepository.findByEmail(request.getEmail());
        if (pending == null || pending.getOtpExpiresAt() == null
                || pending.getOtpExpiresAt().before(new Date())
                || pending.getEncodedOtp() == null
                || !passwordEncoder.matches(request.getOtp(), pending.getEncodedOtp())) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "That verification code is invalid or expired. Request a new code and try again."
            );
        }
        if (userRepository.findByEmail(pending.getEmail()) != null) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "This email address already exists. Please log in instead."
            );
        }

        User savedUser = new User();
        savedUser.setEmail(pending.getEmail());
        savedUser.setFullName(pending.getFullName());
        savedUser.setRole(pending.getRole());
        savedUser.setPassword(pending.getEncodedPassword());
        savedUser.setEmailVerified(true);
        savedUser = userRepository.save(savedUser);

        Cart cart = new Cart();
        cart.setCustomer(savedUser);
        cartRepository.save(cart);
        pendingRegistrationRepository.delete(pending);

        AuthResponse authResponse = new AuthResponse();
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                savedUser.getEmail(),
                null,
                java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                        savedUser.getRole().toString())));
        authResponse.setJwt(jwtProvider.generateToken(authentication));
        authResponse.setMessage("Account Created Successfully");
        authResponse.setRole(savedUser.getRole());
        return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        if (request == null || request.getEmail() == null || request.getEmail().isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email is required.");
        }

        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "No account was found with this email.");
        }

        PendingPasswordReset pending = pendingPasswordResetRepository.findByEmail(email);
        if (pending == null) {
            pending = new PendingPasswordReset();
        }
        pending.setEmail(email);
        pending.setOtpExpiresAt(new Date(System.currentTimeMillis() + 5 * 60 * 1000L));

        String otp = generateOtp();
        pending.setEncodedOtp(passwordEncoder.encode(otp));
        pendingPasswordResetRepository.save(pending);

        try {
            emailService.sendEmail(
                    email,
                    "Reset your SwadExpress password",
                    EmailTemplateBuilder.otpEmail(
                            "Reset your SwadExpress password",
                            "Use the OTP below to securely create a new password.",
                            otp,
                            user.getFullName())
            );
        } catch (MailSendException exception) {
            pendingPasswordResetRepository.delete(pending);
            throw new ApiException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "We couldn't send the password reset email. Please try again later."
            );
        }

        AuthResponse response = new AuthResponse();
        response.setMessage("Password reset OTP sent to your email");
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody ForgotPasswordRequest request) {
        if (request.getEmail() == null || request.getOtp() == null
                || request.getPassword() == null || request.getConfirmPassword() == null) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Email, verification code, and both password fields are required."
            );
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "The passwords do not match.");
        }
        if (request.getPassword().length() < 6) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters.");
        }

        String email = request.getEmail().trim().toLowerCase();
        PendingPasswordReset pending = pendingPasswordResetRepository.findByEmail(email);
        if (pending == null || pending.getOtpExpiresAt().before(new Date())
                || !passwordEncoder.matches(request.getOtp(), pending.getEncodedOtp())) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "That verification code is invalid or expired. Request a new code and try again."
            );
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "No account was found with this email.");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        pendingPasswordResetRepository.delete(pending);

        AuthResponse response = new AuthResponse();
        response.setMessage("Password reset successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest req) {
        if (req == null || req.getEmail() == null || req.getEmail().isBlank()
                || req.getPassword() == null || req.getPassword().isBlank()) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Email and password are required."
            );
        }

        String username = req.getEmail().trim().toLowerCase();
        String password = req.getPassword();

        Authentication authentication=authenticate(username,password);

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        String role=authorities.isEmpty() ?null:authorities.iterator().next().getAuthority();

        String jwt = jwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Login Successfully");
        authResponse.setRole(USER_ROLE.valueOf(role));

        return new ResponseEntity<>(authResponse, HttpStatus.OK);

    }

    private Authentication authenticate(String username, String password) {

        UserDetails userDetails=customUserDetailsService.loadUserByUsername(username);

        if(userDetails==null){
            throw new UsernameNotFoundException("Invalid username...");

        }
        if (!passwordEncoder.matches(password,userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid password...");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    private String generateOtp() {
        return String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
    }

}
