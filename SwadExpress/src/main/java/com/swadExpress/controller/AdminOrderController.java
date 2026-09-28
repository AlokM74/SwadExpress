package com.swadExpress.controller;

import com.swadExpress.entity.Order;
import com.swadExpress.entity.User;
import com.swadExpress.service.OrderService;
import com.swadExpress.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminOrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @GetMapping("/order/restaurant/{id}")
    public ResponseEntity<List<Order>> getAllOrders(@RequestHeader("Authorization") String jwt,
                                                    @PathVariable Long id,
                                                    @RequestParam(required = false) String orderStatus) throws Exception {

        User user=userService.findUserByJwtToken(jwt);
        List<Order> orders=orderService.getRestaurantOrder(id, orderStatus, user.getId());
        return new ResponseEntity<>(orders, HttpStatus.OK);

    }

    @PutMapping("/order/{id}/{orderStatus}")
    public ResponseEntity<Order> updateOrderStatus(@RequestHeader("Authorization") String jwt,
                                                         @PathVariable Long id,
                                                         @PathVariable String orderStatus) throws Exception {

        User user=userService.findUserByJwtToken(jwt);
        Order orders=orderService.updateOrder(id, orderStatus, user.getId());
        return new ResponseEntity<>(orders, HttpStatus.OK);

    }



}
