package com.cloud.webshop.service;

import com.cloud.webshop.model.Order;
import com.cloud.webshop.response.OrderHistoryResponse;
import org.springframework.stereotype.Service;

import java.util.List;

public interface OrderService {
    Order createOrder(Long userId);
    List<OrderHistoryResponse> getOrderHistory(Long userId);
}