package com.cloud.webshop.response;

import com.cloud.webshop.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartItemResponse {
    private ProductResponse product;
    private int quantity;
    private double totalPrice;
    private long cartId;

    public CartItemResponse() {

    }

    public static CartItemResponse toCartItemResponse(Product product, int quantity, long cartId) {
        CartItemResponse cartItemResponse = new CartItemResponse();
        cartItemResponse.setProduct(ProductResponse.toProductResponse(product));
        cartItemResponse.setQuantity(quantity);
        cartItemResponse.setTotalPrice(product.getPrice().doubleValue() * quantity);
        cartItemResponse.setCartId(cartId);
        return cartItemResponse;
    }
}
