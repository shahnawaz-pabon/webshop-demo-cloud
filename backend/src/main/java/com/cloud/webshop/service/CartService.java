package com.cloud.webshop.service;

import com.cloud.webshop.request.AddToCartRequest;
import com.cloud.webshop.response.CartItemResponse;

public interface CartService {
    public CartItemResponse addToCart(AddToCartRequest request);
}
