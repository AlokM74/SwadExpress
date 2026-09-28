package com.swadExpress.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String encodedPassword;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private USER_ROLE role;

    @Column(nullable = false)
    private String encodedOtp;

    @Column(nullable = false)
    private Date otpExpiresAt;
}
