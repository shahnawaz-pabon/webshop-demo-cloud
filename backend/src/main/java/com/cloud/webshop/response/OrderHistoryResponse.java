package com.cloud.webshop.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderHistoryResponse {
    private List<CartItemResponse> cart;
    private Double totalPrice;
    private int totalLength;
    private Long orderId;
    private String formattedDate;
    private String formattedTime;
    private String status;
    private String orderNumber;
    private Object userData;
}
