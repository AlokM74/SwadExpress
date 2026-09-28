package com.swadExpress.service;


import com.swadExpress.entity.User;
import com.swadExpress.response.PaymentResponse;

public interface RazorpayService {

    PaymentResponse createOrder(User user) throws Exception;

    void verifyPayment(User user, String orderId, String paymentId, String signature, long expectedAmount)
            throws Exception;
}