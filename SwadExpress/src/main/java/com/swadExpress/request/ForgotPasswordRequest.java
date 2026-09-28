package com.swadExpress.request;

import lombok.Data;

@Data
public class ForgotPasswordRequest {

    private String email;
    private String otp;
    private String password;
    private String confirmPassword;
}
