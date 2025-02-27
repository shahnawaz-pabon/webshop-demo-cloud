package com.cloud.webshop.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AddToCartRequest {
    private Long userId;
    private Long productId;
    private int quantity;
}
