package com.cloud.webshop.service.impl;

import com.cloud.webshop.model.Order;
import com.cloud.webshop.repository.CartRepository;
import com.cloud.webshop.repository.OrderProductRepository;
import com.cloud.webshop.repository.OrderRepository;
import com.cloud.webshop.repository.ProductRepository;
import com.cloud.webshop.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderProductRepository orderProductRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Order createOrder(Long userId, String paymentStatus){

        return null;
    }
}
