package com.swadExpress.service.impl;

import com.swadExpress.entity.*;
import com.swadExpress.exception.ApiException;
import com.swadExpress.repository.*;
import com.swadExpress.request.OrderRequest;
import com.swadExpress.service.CartService;
import com.swadExpress.service.OrderService;
import com.swadExpress.service.RazorpayService;
import com.swadExpress.service.EmailService;
import com.swadExpress.util.EmailTemplateBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService  cartService;

    @Autowired
    private RazorpayService razorpayService;

    @Autowired
    private EmailService emailService;


    @Override
    @jakarta.transaction.Transactional
    public Order createOrder(OrderRequest req, User user) throws Exception {

        Cart cart=cartService.findCartByUserId(user.getId());
        if (cart == null || cart.getCartItem() == null || cart.getCartItem().isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Your cart is empty.");
        }

        if (req.getRazorpayPaymentId() != null) {
            Optional<Order> existingOrder = orderRepository.findByRazorpayPaymentId(req.getRazorpayPaymentId());
            if (existingOrder.isPresent()) {
                if (!existingOrder.get().getCustomer().getId().equals(user.getId())) {
                    throw new ApiException(HttpStatus.FORBIDDEN, "This payment does not belong to your account.");
                }
                return existingOrder.get();
            }
        }

        Long totalPrice=cartService.calculateCartTotal(cart);
        Long deliveryFee = 20L;
        Long restaurantCharges = 12L;
        Long payableAmount = totalPrice + deliveryFee + restaurantCharges;
        razorpayService.verifyPayment(
                user,
                req.getRazorpayOrderId(),
                req.getRazorpayPaymentId(),
                req.getRazorpaySignature(),
                payableAmount
        );

        Address requestedAddress = req.getDeliveryAddress();
        Address savedAddress;
        if (requestedAddress == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Please provide a delivery address.");
        }

        if (requestedAddress.getId() != null) {
            savedAddress = user.getAddresses().stream()
                    .filter(address -> requestedAddress.getId().equals(address.getId()))
                    .findFirst()
                    .orElseThrow(() -> new ApiException(
                            HttpStatus.FORBIDDEN,
                            "The selected delivery address does not belong to your account."
                    ));
        } else {
            savedAddress = addressRepository.save(requestedAddress);
            user.getAddresses().add(savedAddress);
            userRepository.save(user);
        }

        Restaurant restaurant = cart.getCartItem().getFirst().getFood().getRestaurant();
        if (restaurant == null) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "Your cart contains an item that is currently unavailable. Please refresh your cart."
            );
        }

        Order createdOrder=new Order();
        createdOrder.setCustomer(user);
        createdOrder.setRestaurant(restaurant);
        createdOrder.setCreatedAt(new Date());
        createdOrder.setOrderStatus("PENDING");
        createdOrder.setDeliveryAddress(savedAddress);

        List<OrderItem> orderItems=new ArrayList<>();
        int totalItem = 0;

        for(CartItem cartItem:cart.getCartItem()){
            OrderItem orderItem=new OrderItem();
            orderItem.setFood(cartItem.getFood());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setIngredients(cartItem.getIngredients());
            orderItem.setTotalPrice(cartItem.getTotalPrice());
            totalItem += cartItem.getQuantity() == null ? 0 : cartItem.getQuantity();

            OrderItem savedOrderItem=orderItemRepository.save(orderItem);
            orderItems.add(savedOrderItem);
        }

        createdOrder.setItems(orderItems);
        createdOrder.setTotalItem(totalItem);
        createdOrder.setTotalAmount(totalPrice);
        createdOrder.setTotalPrice((double) (totalPrice + deliveryFee + restaurantCharges));
        createdOrder.setPaymentStatus("PAID");
        createdOrder.setRazorpayOrderId(req.getRazorpayOrderId());
        createdOrder.setRazorpayPaymentId(req.getRazorpayPaymentId());
        createdOrder.setRazorpaySignature(req.getRazorpaySignature());

        Order savedOrder=orderRepository.save(createdOrder);
        restaurant.getOrders().add(savedOrder);
        cartService.clearCart(user.getId());

        sendOrderConfirmationEmail(savedOrder);

        return createdOrder;
    }

    private void sendOrderConfirmationEmail(Order order) {
        User customer = order.getCustomer();
        if (customer == null || customer.getEmail() == null || customer.getEmail().isBlank()) {
            logger.warn("Skipping order confirmation email for order {}: customer email is missing",
                    order.getId());
            return;
        }

        StringBuilder items = new StringBuilder();
        for (OrderItem item : order.getItems()) {
            items.append("<tr>")
                    .append("<td style=\"padding:12px 0;border-bottom:1px solid #f1f1f1;color:#171717;\">")
                    .append(EmailTemplateBuilder.escape(item.getFood().getName()))
                    .append("<div style=\"color:#6b7280;font-size:12px;margin-top:4px;\">Qty: ")
                    .append(EmailTemplateBuilder.escape(item.getQuantity()))
                    .append("</div></td>")
                    .append("<td style=\"padding:12px 0;border-bottom:1px solid #f1f1f1;text-align:right;color:#171717;\">₹")
                    .append(EmailTemplateBuilder.escape(item.getTotalPrice()))
                    .append("</td></tr>");
        }

        String restaurantName = order.getRestaurant() == null
                ? "Restaurant"
                : order.getRestaurant().getName();
        String deliveryAddress = order.getDeliveryAddress() == null
                ? "Address unavailable"
                : String.join(", ",
                        java.util.stream.Stream.of(
                                order.getDeliveryAddress().getStreetAddress(),
                                order.getDeliveryAddress().getCity(),
                                order.getDeliveryAddress().getStateProvince())
                                .filter(value -> value != null && !value.isBlank())
                                .toList());

        String body = EmailTemplateBuilder.page(
                "<p style=\"margin:0 0 8px;color:#171717;font-size:16px;\">Hello "
                        + EmailTemplateBuilder.escape(customer.getFullName()) + ",</p>"
                        + "<h1 style=\"margin:0;color:#171717;font-size:24px;\">Order confirmed!</h1>"
                        + "<p style=\"margin:10px 0 22px;color:#6b7280;line-height:1.6;\">"
                        + "Your delicious order has been placed successfully and is being prepared."
                        + "</p>"
                        + "<div style=\"padding:16px;border-radius:12px;background:#fff7ed;border:1px solid #fed7aa;\">"
                        + "<div style=\"color:#9a3412;font-size:12px;text-transform:uppercase;letter-spacing:1px;\">Order details</div>"
                        + "<div style=\"margin-top:8px;color:#171717;\"><strong>Order ID:</strong> #"
                        + EmailTemplateBuilder.escape(order.getId()) + "</div>"
                        + "<div style=\"margin-top:5px;color:#171717;\"><strong>Restaurant:</strong> "
                        + EmailTemplateBuilder.escape(restaurantName) + "</div></div>"
                        + "<h2 style=\"margin:26px 0 8px;color:#171717;font-size:17px;\">Items</h2>"
                        + "<table style=\"width:100%;border-collapse:collapse;font-size:14px;\"><tbody>"
                        + items + "</tbody></table>"
                        + "<div style=\"margin-top:20px;padding-top:16px;border-top:2px solid #7a1f1f;\">"
                        + "<div style=\"display:flex;justify-content:space-between;color:#171717;font-size:18px;\"><strong>Total paid</strong><strong>₹"
                        + EmailTemplateBuilder.escape(order.getTotalPrice()) + "</strong></div>"
                        + "<div style=\"margin-top:8px;color:#6b7280;font-size:13px;\"><strong>Payment:</strong> "
                        + EmailTemplateBuilder.escape(order.getPaymentStatus()) + "</div>"
                        + "<div style=\"margin-top:5px;color:#6b7280;font-size:13px;word-break:break-all;\"><strong>Transaction ID:</strong> "
                        + EmailTemplateBuilder.escape(order.getRazorpayPaymentId()) + "</div></div>"
                        + "<div style=\"margin-top:20px;padding:14px;border-radius:10px;background:#f9fafb;color:#4b5563;font-size:13px;line-height:1.5;\">"
                        + "<strong>Delivery address</strong><br>" + EmailTemplateBuilder.escape(deliveryAddress)
                        + "</div>"
                        + "<p style=\"margin:24px 0 0;color:#6b7280;font-size:13px;\">Thank you for choosing SwadExpress.</p>"
        );

        try {
            emailService.sendEmail(
                    customer.getEmail(),
                    "SwadExpress order confirmed - #" + order.getId(),
                    body
            );
        } catch (RuntimeException exception) {
            logger.error("Order {} was created, but confirmation email could not be sent",
                    order.getId(), exception);
        }
    }

    @Override
    public Order updateOrder(Long orderId, String orderStatus, Long ownerId) throws Exception {

        Order order=findOrderById(orderId);
        if (ownerId == null
                || order.getRestaurant() == null
                || order.getRestaurant().getOwner() == null
                || !ownerId.equals(order.getRestaurant().getOwner().getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You don't have permission to update this order.");
        }

        String currentStatus = order.getOrderStatus() == null
                ? ""
                : order.getOrderStatus().trim().toUpperCase();
        String requestedStatus = orderStatus == null
                ? ""
                : orderStatus.trim().toUpperCase();
        String allowedNextStatus = switch (currentStatus) {
            case "PENDING" -> "COMPLETED";
            case "COMPLETED" -> "OUT_FOR_DELIVERY";
            case "OUT_FOR_DELIVERY" -> "DELIVERED";
            default -> null;
        };

        if (allowedNextStatus == null) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "This order can no longer be updated."
            );
        }
        if (!allowedNextStatus.equals(requestedStatus)) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "This order must move to " + allowedNextStatus.replace('_', ' ').toLowerCase()
                            + " before it can be updated to another status."
            );
        }

        order.setOrderStatus(requestedStatus);
        Order updatedOrder = orderRepository.save(order);
        if ("DELIVERED".equals(requestedStatus)) {
            sendOrderDeliveredEmail(updatedOrder);
        }
        return updatedOrder;

    }

    private void sendOrderDeliveredEmail(Order order) {
        User customer = order.getCustomer();
        if (customer == null || customer.getEmail() == null || customer.getEmail().isBlank()) {
            logger.warn("Skipping delivery email for order {}: customer email is missing", order.getId());
            return;
        }

        String restaurantName = order.getRestaurant() == null
                ? "the restaurant"
                : order.getRestaurant().getName();
        String body = EmailTemplateBuilder.page(
                "<div style=\"margin:0 0 24px;padding:20px;border-radius:14px;background:#ecfdf5;border:1px solid #a7f3d0;text-align:center;\">"
                        + "<div style=\"margin:0 auto 10px;width:48px;height:48px;line-height:48px;border-radius:50%;background:#10b981;color:#ffffff;font-size:26px;font-weight:700;\">✓</div>"
                        + "<div style=\"color:#047857;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;\">Delivery complete</div>"
                        + "<h1 style=\"margin:8px 0 0;color:#064e3b;font-size:26px;\">Your order has arrived!</h1>"
                        + "</div>"
                        + "<p style=\"margin:0 0 8px;color:#171717;font-size:16px;\">Hello "
                        + EmailTemplateBuilder.escape(customer.getFullName()) + ",</p>"
                        + "<p style=\"margin:0 0 22px;color:#6b7280;line-height:1.6;\">"
                        + "Your order from <strong style=\"color:#171717;\">"
                        + EmailTemplateBuilder.escape(restaurantName)
                        + "</strong> has been delivered. We hope you enjoy every bite!</p>"
                        + "<div style=\"margin:0 0 22px;padding:16px 18px;border-radius:12px;background:#fafafa;border:1px solid #e5e7eb;\">"
                        + "<div style=\"margin-bottom:10px;color:#9ca3af;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;\">Order details</div>"
                        + "<div style=\"padding-bottom:8px;color:#374151;font-size:14px;\">Order number <strong style=\"float:right;color:#171717;\">#"
                        + EmailTemplateBuilder.escape(order.getId()) + "</strong></div>"
                        + "<div style=\"color:#374151;font-size:14px;\">Status <strong style=\"float:right;color:#059669;\">Delivered</strong></div>"
                        + "</div>"
                        + "<p style=\"margin:0;color:#6b7280;font-size:13px;line-height:1.6;text-align:center;\">"
                        + "Thank you for choosing <strong style=\"color:#7a1f1f;\">SwadExpress</strong>."
                        + " We look forward to serving you again!</p>"
        );

        try {
            emailService.sendEmail(
                    customer.getEmail(),
                    "Your SwadExpress order has been delivered - #" + order.getId(),
                    body
            );
        } catch (RuntimeException exception) {
            logger.error("Order {} was marked delivered, but the delivery email could not be sent",
                    order.getId(), exception);
        }
    }

    @Override
    public void cancelOrder(Long orderId) throws Exception {

        Order order=findOrderById(orderId);
        orderRepository.deleteById(orderId);

    }

    @Override
    public List<Order> getUserOrder(Long userId) throws Exception {
        return orderRepository.findByCustomerId(userId);
    }

    @Override
    public List<Order> getRestaurantOrder(Long restaurantId, String orderStatus, Long ownerId) throws Exception {

        Restaurant restaurant = restaurantRepository.findByOwnerId(ownerId);
        if (restaurant == null || !restaurantId.equals(restaurant.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You don't have permission to view these orders.");
        }

        List<Order> orders=orderRepository.findByRestaurantId(restaurantId);
        if(orderStatus!=null){
            orders = orders.stream().filter(order ->
                    order.getOrderStatus().equals(orderStatus)).collect(Collectors.toList());

        }

        return orders;
    }

    @Override
    public Order findOrderById(Long orderId) throws Exception {

        Optional<Order> optionalOrder=orderRepository.findById(orderId);
        if(optionalOrder.isEmpty()){
            throw new ApiException(HttpStatus.NOT_FOUND, "The requested order could not be found.");

        }

        return optionalOrder.get();
    }
}
