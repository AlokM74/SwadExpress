package com.swadExpress.request;

import lombok.Data;

@Data
public class EmailVerificationRequest {
    private String otp;
}
