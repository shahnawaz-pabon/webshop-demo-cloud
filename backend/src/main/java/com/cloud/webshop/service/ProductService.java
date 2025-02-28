package com.cloud.webshop.service;

import com.cloud.webshop.model.Product;
import com.cloud.webshop.response.ApiResponse;
import com.cloud.webshop.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    Optional<Product> getProductById(Long id);
    ApiResponse<List<ProductResponse>> getAllProducts(int page, int size, String keyword);
}
