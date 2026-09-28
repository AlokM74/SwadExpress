package com.swadExpress.request;

import com.swadExpress.entity.Address;
import lombok.Data;

@Data
public class OrderRequest {

    private Long restaurantId;
    private Address deliveryAddress;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

}
