package com.cloud.webshop.service.impl;

import com.cloud.webshop.model.*;
import com.cloud.webshop.repository.*;
import com.cloud.webshop.response.CartItemResponse;
import com.cloud.webshop.response.OrderHistoryResponse;
import com.cloud.webshop.response.ProductResponse;
import com.cloud.webshop.service.EmailService;
import com.cloud.webshop.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderProductRepository orderProductRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmailService emailService;

    @Override
    @Transactional
    public Order createOrder(Long userId) {
        // Fetch the user's cart items with product details in a single query
        List<Cart> cartItems = cartRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Fetch all product IDs in the cart
        List<Long> productIds = cartItems.stream()
                .map(cartItem -> cartItem.getProduct().getProductId())
                .collect(Collectors.toList());

        // Fetch all inventories for the products in the cart in a single query
        List<Inventory> inventories = inventoryRepository.findByProductIdIn(productIds);

        // Group inventories by product ID for quick lookup
        Map<Long, List<Inventory>> inventoryMap = inventories.stream()
                .collect(Collectors.groupingBy(inventory -> inventory.getProduct().getProductId()));

        // Check inventory levels and calculate total amount
        double totalAmount = 0;
        for (Cart cartItem : cartItems) {
            List<Inventory> productInventories = inventoryMap.get(cartItem.getProduct().getProductId());
            if (productInventories == null || productInventories.isEmpty()) {
                throw new RuntimeException("No inventory found for product: " + cartItem.getProduct().getTitle());
            }

            int totalStock = productInventories.stream()
                    .mapToInt(Inventory::getStockLevel)
                    .sum();
            if (totalStock < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + cartItem.getProduct().getTitle());
            }

            totalAmount += cartItem.getProduct().getPrice() * cartItem.getQuantity();
        }

        // Create the order
        Order order = new Order();
        order.setUserId(userId);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(totalAmount);
        order.setPaymentStatus("paid");

        // Save the order
        order = orderRepository.save(order);

        // Move items from cart to order and update inventory
        List<Inventory> inventoriesToUpdate = new ArrayList<>();
        for (Cart cartItem : cartItems) {
            // Create order product
            OrderProduct orderProduct = new OrderProduct();
            orderProduct.setId(new OrderProductId(order.getOrderId(), cartItem.getProduct().getProductId()));
            orderProduct.setOrder(order);
            orderProduct.setProduct(cartItem.getProduct());
            orderProduct.setQuantity(cartItem.getQuantity());

            orderProductRepository.save(orderProduct);

            // Deduct purchased quantity from inventory
            List<Inventory> productInventories = inventoryMap.get(cartItem.getProduct().getProductId());
            int remainingQuantity = cartItem.getQuantity();

            for (Inventory inventory : productInventories) {
                if (inventory.getStockLevel() >= remainingQuantity) {
                    inventory.setStockLevel(inventory.getStockLevel() - remainingQuantity);
                    inventoriesToUpdate.add(inventory);
                    break;
                } else {
                    remainingQuantity -= inventory.getStockLevel();
                    inventory.setStockLevel(0);
                    inventoriesToUpdate.add(inventory);
                }
            }
        }

        // Update all inventories in bulk
        inventoryRepository.saveAll(inventoriesToUpdate);

        // Clear the user's cart
        cartRepository.deleteByUserId(userId);

        return order;
    }

    @Override
    public List<OrderHistoryResponse> getOrderHistory(Long userId) {
        // Fetch orders for the user
        List<Order> orders = orderRepository.findByUserId(userId);

        // Map orders to OrderHistoryResponse
        return orders.stream()
                .map(this::mapToOrderHistoryResponse)
                .collect(Collectors.toList());
    }

    private OrderHistoryResponse mapToOrderHistoryResponse(Order order) {
        OrderHistoryResponse response = new OrderHistoryResponse();
        response.setOrderId(order.getOrderId());
        response.setFormattedDate(order.getOrderDate().toLocalDate().toString()); // Format date
        response.setFormattedTime(order.getOrderDate().toLocalTime().toString()); // Format time
        response.setStatus(order.getOrderStatus());
        response.setOrderNumber(order.getOrderNumber());

        // Map order products to CartItemResponse
        List<CartItemResponse> cartItems = order.getOrderProducts().stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());
        response.setCart(cartItems);

        // Calculate total price and total length
        double totalPrice = cartItems.stream()
                .mapToDouble(CartItemResponse::getTotalPrice)
                .sum(); // Use sum() for double

        int totalLength = cartItems.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        response.setTotalPrice(totalPrice);
        response.setTotalLength(totalLength);

        return response;
    }

    private CartItemResponse mapToCartItemResponse(OrderProduct orderProduct) {
        CartItemResponse response = new CartItemResponse();
        response.setProduct(mapToProductResponse(orderProduct.getProduct()));
        response.setQuantity(orderProduct.getQuantity());
        response.setTotalPrice(orderProduct.getProduct().getPrice() * orderProduct.getQuantity());
        return response;
    }

    private ProductResponse mapToProductResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setProductId(product.getProductId());
        response.setTitle(product.getTitle());
        response.setCategory(product.getSummary());
        response.setPrice(product.getPrice());
        response.setDescription(product.getDescription());
        response.setImageUrl(product.getImageUrl());
        return response;
    }

    public void updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Update the status
        order.setOrderStatus(newStatus);
        orderRepository.save(order);

        // Send email notification
        String subject = "Order Status Updated";
        String text = "Your order (Number: " + order.getOrderNumber() + ") status has been updated to: " + newStatus;
        emailService.sendEmail("s.pabon93@gmail.com", subject, text);
    }
}