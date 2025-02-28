package com.cloud.webshop.service;

import com.cloud.webshop.request.AddToCartRequest;
import com.cloud.webshop.response.CartItemResponse;
import com.cloud.webshop.response.CartListResponse;

public interface CartService {
    public CartItemResponse addToCart(AddToCartRequest request);
    public CartListResponse getCartList(Long userId);
    void deleteCartItem(Long cartId);
}
