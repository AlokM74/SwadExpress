package com.swadExpress.repository;

import com.swadExpress.entity.PaymentCheckout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentCheckoutRepository extends JpaRepository<PaymentCheckout, Long> {

    Optional<PaymentCheckout> findByRazorpayOrderId(String razorpayOrderId);
}
