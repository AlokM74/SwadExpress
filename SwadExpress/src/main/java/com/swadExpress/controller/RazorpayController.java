package com.swadExpress.controller;

import com.swadExpress.entity.User;
import com.swadExpress.response.PaymentResponse;
import com.swadExpress.service.RazorpayService;
import com.swadExpress.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class RazorpayController {

    @Autowired
    private RazorpayService razorpayService;

    @Autowired
    private UserService userService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        PaymentResponse response = razorpayService.createOrder(user);
        return ResponseEntity.ok(response);
    }
}