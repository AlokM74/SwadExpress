package com.swadExpress.response;

import com.swadExpress.entity.Address;
import com.swadExpress.entity.Order;
import com.swadExpress.entity.OrderItem;
import lombok.Data;

import java.util.Collections;
import java.util.Date;
import java.util.List;

@Data
public class OrderHistoryResponse {

    private Long id;
    private RestaurantSummary restaurant;
    private Long totalAmount;
    private String orderStatus;
    private String paymentStatus;
    private String transactionId;
    private Date createdAt;
    private Address deliveryAddress;
    private List<ItemSummary> items;
    private Integer totalItem;
    private Double totalPrice;

    public static OrderHistoryResponse from(Order order) {
        OrderHistoryResponse response = new OrderHistoryResponse();
        response.id = order.getId();
        response.restaurant = order.getRestaurant() == null
                ? null
                : new RestaurantSummary(order.getRestaurant().getId(), order.getRestaurant().getName());
        response.totalAmount = order.getTotalAmount();
        response.orderStatus = order.getOrderStatus();
        response.paymentStatus = order.getPaymentStatus();
        response.transactionId = order.getRazorpayPaymentId();
        response.createdAt = order.getCreatedAt();
        response.deliveryAddress = order.getDeliveryAddress();
        response.items = order.getItems() == null
                ? Collections.emptyList()
                : order.getItems().stream().map(ItemSummary::from).toList();
        response.totalItem = order.getTotalItem();
        response.totalPrice = order.getTotalPrice();
        return response;
    }

    public record RestaurantSummary(Long id, String name) {
    }

    @Data
    public static class ItemSummary {
        private String orderId;
        private FoodSummary food;
        private Integer quantity;
        private Double totalPrice;
        private List<String> ingredients;

        private static ItemSummary from(OrderItem item) {
            ItemSummary summary = new ItemSummary();
            summary.orderId = item.getOrderId();
            summary.food = item.getFood() == null
                    ? null
                    : new FoodSummary(
                            item.getFood().getId(),
                            item.getFood().getName(),
                            item.getFood().getImages());
            summary.quantity = item.getQuantity();
            summary.totalPrice = item.getTotalPrice();
            summary.ingredients = item.getIngredients();
            return summary;
        }
    }

    public record FoodSummary(Long id, String name, List<String> images) {
    }
}
