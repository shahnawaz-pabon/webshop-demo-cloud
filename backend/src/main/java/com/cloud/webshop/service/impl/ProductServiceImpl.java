package com.cloud.webshop.service.impl;

import com.cloud.webshop.model.Inventory;
import com.cloud.webshop.model.Product;
import com.cloud.webshop.repository.InventoryRepository;
import com.cloud.webshop.repository.ProductRepository;
import com.cloud.webshop.response.ApiResponse;
import com.cloud.webshop.response.ProductNameResponse;
import com.cloud.webshop.response.ProductResponse;
import com.cloud.webshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.cloud.webshop.request.ProductRequest;
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryRepository inventoryRepository;
    
    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public ApiResponse<List<ProductResponse>> getAllProducts(int page, int size, String keyword) {
        // Create a Pageable object for pagination
        Pageable pageable = PageRequest.of(page, size);

        // Fetch products with inventory and apply keyword search
        Page<Product> productPage;
        if (keyword != null && !keyword.isEmpty()) {
            productPage = productRepository.findByTitleContainingOrCategoryContaining(keyword, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        // Map products to ProductResponse with available quantity
        List<ProductResponse> productResponses = productPage.getContent().stream()
                .filter(product -> {
                    // Filter products that have inventory
                    List<Inventory> inventories = inventoryRepository.findByProductId(product.getProductId());
                    return !inventories.isEmpty();
                })
                .map(product -> {
                    ProductResponse response = ProductResponse.toProductResponse(product);
                    // Calculate available quantity
                    int availableQuantity = inventoryRepository.findByProductId(product.getProductId())
                            .stream()
                            .mapToInt(Inventory::getStockLevel)
                            .sum();
                    response.setQuantity(availableQuantity);
                    return response;
                })
                .collect(Collectors.toList());

        // Create a custom page for the filtered results
        Page<ProductResponse> filteredPage = new PageImpl<>(
                productResponses,
                pageable,
                productResponses.size()
        );

        // Return paginated response
        return new ApiResponse<>(
                "success",
                "Products retrieved successfully",
                filteredPage.getContent(),
                filteredPage.getNumber(),
                filteredPage.getSize(),
                filteredPage.getTotalPages(),
                filteredPage.getTotalElements()
        );
    }
    @Override
    public ProductResponse addProduct(ProductRequest request) {
        // Create a new product
        Product product = new Product();
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setSummary(request.getCategory());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());

        // Save the product
        Product savedProduct = productRepository.save(product);

        // Map the saved product to ProductResponse
        return ProductResponse.toProductResponse(savedProduct);
    }

    @Override
    public List<ProductNameResponse> getProductList(){
        // Fetch all products
        List<Product> products = productRepository.findAll();

        // Map products to ProductResponseMinimal
        return products.stream()
                .map(ProductNameResponse::toProductResponse)
                .collect(Collectors.toList());
    }
}

