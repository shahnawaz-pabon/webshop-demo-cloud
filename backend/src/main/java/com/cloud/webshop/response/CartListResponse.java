package com.cloud.webshop.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CartListResponse {
    private List<CartItemResponse> cart;
    private double totalPrice;
    private int totalLength;

    public CartListResponse() {

    }
}
