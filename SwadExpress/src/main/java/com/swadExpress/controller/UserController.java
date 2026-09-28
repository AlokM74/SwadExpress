package com.swadExpress.controller;

import com.swadExpress.entity.User;
import com.swadExpress.entity.Address;
import com.swadExpress.entity.PendingEmailVerification;
import com.swadExpress.exception.ApiException;
import com.swadExpress.request.UserProfileRequest;
import com.swadExpress.repository.AddressRepository;
import com.swadExpress.repository.PendingEmailVerificationRepository;
import com.swadExpress.repository.UserRepository;
import com.swadExpress.request.EmailVerificationRequest;
import com.swadExpress.service.EmailService;
import com.swadExpress.util.EmailTemplateBuilder;
import com.swadExpress.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.security.SecureRandom;
import java.util.Date;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PendingEmailVerificationRepository pendingEmailVerificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @GetMapping("/profile")
    public ResponseEntity<User> findUserByJwtToken(@RequestHeader("Authorization") String jwt) throws Exception{

        User user=userService.findUserByJwtToken(jwt);

        return new ResponseEntity<>(user, HttpStatus.OK);

    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @RequestHeader("Authorization") String jwt,
            @RequestBody UserProfileRequest request) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/profile/email-verification/send")
    public ResponseEntity<String> sendEmailVerification(
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        if (user.isEmailVerified()) {
            return ResponseEntity.ok("Email is already verified");
        }

        PendingEmailVerification verification =
                pendingEmailVerificationRepository.findByUser(user);
        if (verification == null) {
            verification = new PendingEmailVerification();
            verification.setUser(user);
        }

        String otp = String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
        verification.setEncodedOtp(passwordEncoder.encode(otp));
        verification.setOtpExpiresAt(new Date(System.currentTimeMillis() + 5 * 60 * 1000L));
        pendingEmailVerificationRepository.save(verification);

        emailService.sendEmail(
                user.getEmail(),
                "Verify your SwadExpress email",
                EmailTemplateBuilder.otpEmail(
                        "Verify your SwadExpress email",
                        "Use the OTP below to verify your email address.",
                        otp,
                        user.getFullName())
        );
        return ResponseEntity.accepted().body("Verification OTP sent to your email");
    }

    @PostMapping("/profile/email-verification/verify")
    public ResponseEntity<User> verifyEmail(
            @RequestHeader("Authorization") String jwt,
            @RequestBody EmailVerificationRequest request) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        PendingEmailVerification verification =
                pendingEmailVerificationRepository.findByUser(user);
        if (verification == null || request.getOtp() == null
                || verification.getOtpExpiresAt().before(new Date())
                || !passwordEncoder.matches(request.getOtp(), verification.getEncodedOtp())) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "That verification code is invalid or expired. Request a new code and try again."
            );
        }

        user.setEmailVerified(true);
        User savedUser = userRepository.save(user);
        pendingEmailVerificationRepository.delete(verification);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<Address>> getAddresses(
            @RequestHeader("Authorization") String jwt) throws Exception {
        return ResponseEntity.ok(userService.findUserByJwtToken(jwt).getAddresses());
    }

    @PostMapping("/addresses")
    public ResponseEntity<Address> addAddress(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Address address) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        address.setId(null);
        if (user.getAddresses().isEmpty()) {
            address.setDefault(true);
        } else if (Boolean.TRUE.equals(address.getDefault())) {
            user.getAddresses().forEach(existingAddress ->
                    existingAddress.setDefault(false));
        }
        Address savedAddress = addressRepository.save(address);
        user.getAddresses().add(savedAddress);
        userRepository.save(user);
        return new ResponseEntity<>(savedAddress, HttpStatus.CREATED);
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long addressId) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        boolean removed = user.getAddresses().removeIf(address ->
                address.getId() != null && address.getId().equals(addressId));
        if (!removed) {
            throw new ApiException(HttpStatus.NOT_FOUND, "The saved address could not be found.");
        }
        userRepository.save(user);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/addresses/{addressId}/default")
    public ResponseEntity<Address> setDefaultAddress(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long addressId) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Address selectedAddress = user.getAddresses().stream()
                .filter(address -> addressId.equals(address.getId()))
                .findFirst()
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "The saved address could not be found."
                ));

        user.getAddresses().forEach(address ->
                address.setDefault(address.getId().equals(addressId)));
        userRepository.save(user);
        return ResponseEntity.ok(selectedAddress);
    }
}
