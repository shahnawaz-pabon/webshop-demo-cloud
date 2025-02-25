package com.cloud.webshop.service;

import com.cloud.webshop.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface ProductService {
    Optional<Product> getProductById(Long id);
    Page<Product> getAllProducts(Pageable pageable);
}
