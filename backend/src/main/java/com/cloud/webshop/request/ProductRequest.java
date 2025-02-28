package com.cloud.webshop.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductRequest {
    private String title;
    private String description;
    private String category;
    private Double price;
    private String imageUrl;
}
