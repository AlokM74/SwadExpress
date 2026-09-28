package com.swadExpress.config;

import com.swadExpress.exception.ApiErrorWriter;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class AppConfig {

    @Bean
    SecurityFilterChain securityWebFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(management ->
                        management.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(authorize -> authorize

                        .requestMatchers("/auth/login").permitAll()
                        .requestMatchers("/auth/signup").permitAll()
                        .requestMatchers("/auth/verify-registration").permitAll()
                        .requestMatchers("/auth/forgot-password").permitAll()
                        .requestMatchers("/auth/reset-password").permitAll()
                        .requestMatchers("/api/food/search").permitAll()

                        .requestMatchers("/api/admin/**")
                        .hasAnyRole("RESTAURANT_OWNER", "ADMIN")

                        .requestMatchers("/api/**")
                        .authenticated()

                        .anyRequest()
                        .permitAll()
                )

                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, exception) ->
                                ApiErrorWriter.write(
                                        request,
                                        response,
                                        401,
                                        "Please sign in to continue."
                                ))
                        .accessDeniedHandler((request, response, exception) ->
                                ApiErrorWriter.write(
                                        request,
                                        response,
                                        403,
                                        "You don't have permission to perform this action."
                                ))
                )

                .addFilterBefore(
                        new JwtTokenValidator(),
                        BasicAuthenticationFilter.class
                )

                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource())
                );

        return http.build();
    }

    private CorsConfigurationSource corsConfigurationSource() {

        return new CorsConfigurationSource() {

            @Override
            public CorsConfiguration getCorsConfiguration(
                    HttpServletRequest request) {

                CorsConfiguration corsConfiguration =
                        new CorsConfiguration();

                corsConfiguration.addAllowedOrigin(
                        "http://localhost:5173"
                );

                corsConfiguration.addAllowedOrigin(
                        "https://swadexpress-in.vercel.app"
                );

                corsConfiguration.addAllowedOrigin(
                        "https://swadexpress-rho.vercel.app"
                );

                corsConfiguration.setAllowedMethods(
                        Collections.singletonList("*")
                );

                corsConfiguration.setAllowCredentials(true);

                corsConfiguration.setAllowedHeaders(
                        Collections.singletonList("*")
                );

                corsConfiguration.setExposedHeaders(
                        Arrays.asList("Authorization")
                );

                corsConfiguration.setMaxAge(3600L);

                return corsConfiguration;
            }
        };
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}