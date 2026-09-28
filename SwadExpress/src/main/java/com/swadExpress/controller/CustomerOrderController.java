package com.swadExpress.controller;

import com.swadExpress.entity.Order;
import com.swadExpress.entity.User;
import com.swadExpress.response.OrderHistoryResponse;
import com.swadExpress.request.OrderRequest;
import com.swadExpress.service.OrderService;
import com.swadExpress.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CustomerOrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @PostMapping("/order")
    public ResponseEntity<Order> createOrder(@RequestHeader("Authorization") String jwt,
                                             @RequestBody OrderRequest req) throws Exception {

        User user=userService.findUserByJwtToken(jwt);
        Order order=orderService.createOrder(req,user);

        return new ResponseEntity<>(order, HttpStatus.CREATED);

    }

    @GetMapping("/order/user")
    @Transactional
    public ResponseEntity<List<OrderHistoryResponse>> getOrderHistory(@RequestHeader("Authorization") String jwt) throws Exception {

        User user=userService.findUserByJwtToken(jwt);
        List<OrderHistoryResponse> order = orderService.getUserOrder(user.getId())
                .stream()
                .map(OrderHistoryResponse::from)
                .toList();

        return new ResponseEntity<>(order, HttpStatus.OK);

    }


}
