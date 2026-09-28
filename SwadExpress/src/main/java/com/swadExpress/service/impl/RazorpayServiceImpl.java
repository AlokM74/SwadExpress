package com.swadExpress.service.impl;

import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.swadExpress.config.RazorpayConfig;
import com.swadExpress.entity.Cart;
import com.swadExpress.entity.CartItem;
import com.swadExpress.entity.PaymentCheckout;
import com.swadExpress.entity.User;
import com.swadExpress.exception.ApiException;
import com.swadExpress.repository.PaymentCheckoutRepository;
import com.swadExpress.response.PaymentResponse;
import com.swadExpress.service.CartService;
import com.swadExpress.service.RazorpayService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Comparator;
import java.util.Date;
import java.util.stream.Collectors;

@Service
public class RazorpayServiceImpl implements RazorpayService {

    @Autowired
    private RazorpayClient razorpayClient;

    @Autowired
    private CartService cartService;

    @Autowired
    private RazorpayConfig razorpayConfig;

    @Autowired
    private PaymentCheckoutRepository paymentCheckoutRepository;

    @Override
    public PaymentResponse createOrder(User user) throws Exception {
        Cart cart = cartService.findCartByUserId(user.getId());
        if (cart == null || cart.getCartItem() == null || cart.getCartItem().isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Your cart is empty.");
        }

        long amountInRupees = cartService.calculateCartTotal(cart) + 20L + 12L;
        long amountInPaise = amountInRupees * 100L;
        JSONObject orderRequest = new JSONObject();

        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "swadexpress_" + System.currentTimeMillis());

        Order order = razorpayClient.orders.create(orderRequest);
        PaymentCheckout checkout = new PaymentCheckout();
        checkout.setRazorpayOrderId(order.get("id"));
        checkout.setCustomer(user);
        checkout.setAmountInPaise(amountInPaise);
        checkout.setCartFingerprint(cartFingerprint(cart));
        checkout.setStatus("PENDING");
        checkout.setCreatedAt(new Date());
        paymentCheckoutRepository.save(checkout);

        return new PaymentResponse(
                razorpayConfig.getKeyId(),
                order.get("id"),
                amountInPaise,
                "INR"
        );
    }

    @Override
    public void verifyPayment(User user, String orderId, String paymentId, String signature, long expectedAmount)
            throws Exception {
        if (orderId == null || paymentId == null || signature == null
                || orderId.isBlank() || paymentId.isBlank() || signature.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Payment details are required.");
        }

        PaymentCheckout checkout = paymentCheckoutRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "The payment session could not be found."));
        if (!checkout.getCustomer().getId().equals(user.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "This payment session does not belong to your account.");
        }
        if (!"PENDING".equals(checkout.getStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "This payment has already been completed or cancelled.");
        }
        Cart cart = cartService.findCartByUserId(user.getId());
        if (cart == null || !cartFingerprint(cart).equals(checkout.getCartFingerprint())) {
            throw new ApiException(HttpStatus.CONFLICT, "Your cart changed. Please start checkout again.");
        }
        if (checkout.getAmountInPaise() != expectedAmount * 100L) {
            throw new ApiException(HttpStatus.CONFLICT, "The checkout total changed. Please start checkout again.");
        }

        Order razorpayOrder = razorpayClient.orders.fetch(orderId);
        long paidOrderAmount = ((Number) razorpayOrder.get("amount")).longValue();
        if (paidOrderAmount != expectedAmount * 100L) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "The payment amount does not match your order.");
        }

        JSONObject attributes = new JSONObject();
        attributes.put("razorpay_order_id", orderId);
        attributes.put("razorpay_payment_id", paymentId);
        attributes.put("razorpay_signature", signature);
        if (!Utils.verifyPaymentSignature(attributes, razorpayConfig.getKeySecret())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Payment verification failed. Please try again.");
        }

        Payment payment = razorpayClient.payments.fetch(paymentId);
        if (!orderId.equals(payment.get("order_id"))
                || !"captured".equalsIgnoreCase(payment.get("status").toString())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "The payment has not been completed.");
        }
        checkout.setStatus("COMPLETED");
        paymentCheckoutRepository.save(checkout);
    }

    private String cartFingerprint(Cart cart) throws Exception {
        String snapshot = cart.getCartItem().stream()
                .sorted(Comparator.comparing(CartItem::getId))
                .map(item -> item.getId() + ":" + item.getFood().getId() + ":" + item.getQuantity()
                        + ":" + item.getTotalPrice() + ":"
                        + String.join(",", item.getIngredients() == null ? java.util.List.of() : item.getIngredients()))
                .collect(Collectors.joining("|"));
        byte[] digest = MessageDigest.getInstance("SHA-256")
                .digest(snapshot.getBytes(StandardCharsets.UTF_8));
        StringBuilder result = new StringBuilder();
        for (byte value : digest) {
            result.append(String.format("%02x", value));
        }
        return result.toString();
    }
}
