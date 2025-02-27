package com.cloud.webshop.service;

import com.cloud.webshop.model.Order;
import org.springframework.stereotype.Service;

public interface OrderService {
    Order createOrder(Long userId);
}