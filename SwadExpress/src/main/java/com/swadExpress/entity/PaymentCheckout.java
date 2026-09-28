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
public class PaymentCheckout {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, unique = true)
    private String razorpayOrderId;

    @ManyToOne(optional = false)
    private User customer;

    @Column(nullable = false)
    private Long amountInPaise;

    @Column(nullable = false, length = 64)
    private String cartFingerprint;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Date createdAt;
}
