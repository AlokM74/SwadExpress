package com.swadExpress.service;

import com.swadExpress.entity.Order;
import com.swadExpress.entity.User;
import com.swadExpress.request.OrderRequest;

import java.util.List;

public interface OrderService {

    public Order createOrder(OrderRequest req, User user) throws Exception;

    public Order updateOrder(Long orderId, String orderStatus, Long ownerId) throws Exception;

    public void cancelOrder(Long orderId) throws Exception;

    public List<Order> getUserOrder(Long userId) throws Exception;

    public List<Order> getRestaurantOrder(Long restaurantId, String orderStatus, Long ownerId) throws Exception;

    public Order findOrderById(Long orderId) throws Exception;
}
