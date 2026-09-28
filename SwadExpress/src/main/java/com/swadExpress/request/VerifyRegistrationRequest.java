package com.swadExpress.request;

import lombok.Data;

@Data
public class VerifyRegistrationRequest {

    private String email;
    private String otp;
}
