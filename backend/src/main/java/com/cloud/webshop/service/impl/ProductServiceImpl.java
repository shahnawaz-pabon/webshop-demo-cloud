package com.cloud.webshop.service.impl;

import com.cloud.webshop.model.Inventory;
import com.cloud.webshop.model.Product;
import com.cloud.webshop.repository.InventoryRepository;
import com.cloud.webshop.repository.ProductRepository;
import com.cloud.webshop.response.ApiResponse;
import com.cloud.webshop.response.MinMaxResponse;
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
import java.util.Objects;
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
    public ApiResponse<List<ProductResponse>> getAllProducts(int page, int size, String keyword, boolean isAvailable) {
        // Create a Pageable object for pagination
        Pageable pageable = PageRequest.of(page, size);

        // Fetch products with keyword search (if provided)
        Page<Product> productPage;
        if (keyword != null && !keyword.isEmpty()) {
            productPage = productRepository.findByTitleContainingOrCategoryContaining(keyword, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        // Map products to ProductResponse with available quantity and inventory details
        List<ProductResponse> productResponses = productPage.getContent().stream()
                .map(product -> {
                    // Fetch inventories for the product
                    List<Inventory> inventories = inventoryRepository.findByProductId(product.getProductId());

                    // Calculate total available quantity
                    int availableQuantity = inventories.stream()
                            .mapToInt(Inventory::getStockLevel)
                            .sum();

                    // Skip products with no inventory if isAvailable is true
                    if (isAvailable && availableQuantity <= 0) {
                        return null; // Skip products with no inventory
                    }

                    // Create ProductResponse
                    ProductResponse response = ProductResponse.toProductResponse(product);
                    response.setQuantity(availableQuantity);

                    // Include the first inventory ID (if available)
                    if (!inventories.isEmpty()) {
                        response.setInventoryId(inventories.get(0).getInventoryId()); // First inventory ID
                    } else {
                        response.setInventoryId(null); // No inventory ID
                    }

                    return response;
                })
                .filter(Objects::nonNull) // Remove null entries (products skipped due to isAvailable)
                .collect(Collectors.toList());

        // Create a custom page for the results
        Page<ProductResponse> resultPage = new PageImpl<>(
                productResponses,
                pageable,
                productPage.getTotalElements() // Use the total elements from the original query
        );

        // Return paginated response
        return new ApiResponse<>(
                "success",
                "Products retrieved successfully",
                resultPage.getContent(),
                resultPage.getNumber(),
                resultPage.getSize(),
                resultPage.getTotalPages(),
                resultPage.getTotalElements()
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

    @Override
    public MinMaxResponse getMinMaxValues() {
        // Fetch min and max prices from the database
        Double minPrice = productRepository.findMinPrice();
        Double maxPrice = productRepository.findMaxPrice();

        // Create the response
        MinMaxResponse response = new MinMaxResponse();
        response.setMinValue((int) (minPrice != null ? minPrice : 0));
        response.setMaxValue((int) (maxPrice != null ? maxPrice : 0));

        return response;
    }
}

