package com.cloud.webshop.controller;

import com.cloud.webshop.model.Order;
import com.cloud.webshop.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/order")
@Tag(name = "Order Operations", description = "APIs for managing orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    @Operation(
            summary = "Create an order",
            description = "Create an order from the user's cart list."
    )
    public ResponseEntity<Order> createOrder(@RequestParam Long userId) {
        Order order = orderService.createOrder(userId);
        return ResponseEntity.ok(order);
    }
}
