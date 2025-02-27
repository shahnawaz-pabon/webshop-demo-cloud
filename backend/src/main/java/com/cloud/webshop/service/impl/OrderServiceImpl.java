package com.cloud.webshop.service.impl;

import com.cloud.webshop.model.Cart;
import com.cloud.webshop.model.Order;
import com.cloud.webshop.model.OrderProduct;
import com.cloud.webshop.model.OrderProductId;
import com.cloud.webshop.repository.CartRepository;
import com.cloud.webshop.repository.OrderProductRepository;
import com.cloud.webshop.repository.OrderRepository;
import com.cloud.webshop.repository.ProductRepository;
import com.cloud.webshop.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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
    @Transactional
    public Order createOrder(Long userId) {
        // Fetch the user's cart items
        List<Cart> cartItems = cartRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate the total amount using double
        double totalAmount = cartItems.stream()
                .mapToDouble(cartItem -> cartItem.getProduct().getPrice() * cartItem.getQuantity())
                .sum();

        // Create the order
        Order order = new Order();
        order.setUserId(userId);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(totalAmount);
        order.setPaymentStatus("paid");

        // Save the order
        order = orderRepository.save(order);

        // Move items from cart to order
        for (Cart cartItem : cartItems) {
            OrderProduct orderProduct = new OrderProduct();
            orderProduct.setId(new OrderProductId(order.getOrderId(), cartItem.getProduct().getProductId()));
            orderProduct.setOrder(order);
            orderProduct.setProduct(cartItem.getProduct());
            orderProduct.setQuantity(cartItem.getQuantity());

            orderProductRepository.save(orderProduct);
        }

        // Clear the user's cart
        cartRepository.deleteByUserId(userId);

        return order;
    }
}