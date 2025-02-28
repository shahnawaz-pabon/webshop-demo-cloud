package com.cloud.webshop.response;

import com.cloud.webshop.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductNameResponse {
    private Long productId;
    private String title;

    public static ProductNameResponse toProductResponse(Product product) {
        return ProductNameResponse.builder()
                .productId(product.getProductId())
                .title(product.getTitle())
                .build();
    }
}
