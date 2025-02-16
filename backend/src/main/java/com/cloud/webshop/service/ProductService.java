package com.cloud.webshop.service;

import com.cloud.webshop.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Product getProductById(Long id);
    Page<Product> getAllProducts(Pageable pageable);
}
