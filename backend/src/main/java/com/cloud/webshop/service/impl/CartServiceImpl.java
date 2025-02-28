package com.cloud.webshop.service.impl;

import com.cloud.webshop.model.Cart;
import com.cloud.webshop.model.Product;
import com.cloud.webshop.repository.CartRepository;
import com.cloud.webshop.repository.ProductRepository;
import com.cloud.webshop.request.AddToCartRequest;
import com.cloud.webshop.response.CartItemResponse;
import com.cloud.webshop.response.CartListResponse;
import com.cloud.webshop.response.ProductResponse;
import com.cloud.webshop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public CartItemResponse addToCart(AddToCartRequest request) {
        // Check if the product exists
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if the product is already in the cart
        Optional<Cart> existingCartItem = cartRepository.findByUserIdAndProduct_ProductId(request.getUserId(), request.getProductId());

        Cart cartItem;
        if (existingCartItem.isPresent()) {
            // Update quantity if the product is already in the cart
            cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        } else {
            // Add new item to the cart
            cartItem = new Cart();
            cartItem.setUserId(request.getUserId());
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
        }

        cartRepository.save(cartItem);

        // Prepare response
        return buildCartItemResponse(product, cartItem.getQuantity(),cartItem.getCartId());
    }


    private CartItemResponse buildCartItemResponse(Product product, int quantity, long cartId) {
        ProductResponse productResponse = ProductResponse.toProductResponse(product);

        CartItemResponse cartItemResponse = CartItemResponse.toCartItemResponse(product, quantity, cartId);
        cartItemResponse.setProduct(productResponse);
        cartItemResponse.setQuantity(quantity);
        cartItemResponse.setTotalPrice(product.getPrice() * quantity);

        return cartItemResponse;
    }

    public CartListResponse getCartList(Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);

        List<CartItemResponse> cartItemResponses = new ArrayList<>();
        double totalPrice = 0;
        int totalLength = 0;

        for (Cart cartItem : cartItems) {
            Product product = cartItem.getProduct();
            CartItemResponse cartItemResponse = buildCartItemResponse(product, cartItem.getQuantity(), cartItem.getCartId());
            cartItemResponses.add(cartItemResponse);

            totalPrice += cartItemResponse.getTotalPrice();
            totalLength += cartItem.getQuantity();
        }

        CartListResponse response = new CartListResponse();
        response.setCart(cartItemResponses);
        response.setTotalPrice(totalPrice);
        response.setTotalLength(totalLength);

        return response;
    }
}
