package com.cloud.webshop.controller;

import com.cloud.webshop.model.Order;
import com.cloud.webshop.response.ApiResponse;
import com.cloud.webshop.response.OrderHistoryResponse;
import com.cloud.webshop.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<ApiResponse<Order>> createOrder(
            @RequestParam Long userId) {
        // Create the order
        Order order = orderService.createOrder(userId);

        // Prepare the API response
        ApiResponse<Order> response = new ApiResponse<>(
                "success",
                "Order created successfully",
                order
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<OrderHistoryResponse>>> getOrderHistory(@RequestParam Long userId) {
        List<OrderHistoryResponse> orderHistory = orderService.getOrderHistory(userId);
        ApiResponse<List<OrderHistoryResponse>> response = new ApiResponse<>(
                "success",
                "Order history retrieved successfully",
                orderHistory
        );
        return ResponseEntity.ok(response);
    }
}
