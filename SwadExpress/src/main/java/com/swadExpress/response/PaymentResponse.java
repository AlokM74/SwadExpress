package com.swadExpress.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentResponse {

    private String keyId;
    private String orderId;
    private Long amount;
    private String currency;
}
