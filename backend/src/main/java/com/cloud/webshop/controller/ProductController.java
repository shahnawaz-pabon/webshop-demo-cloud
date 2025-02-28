package com.cloud.webshop.controller;

import com.cloud.webshop.model.Product;
import com.cloud.webshop.request.ProductRequest;
import com.cloud.webshop.response.ProductNameResponse;
import com.cloud.webshop.response.ProductResponse;
import com.cloud.webshop.response.ApiResponse;
import com.cloud.webshop.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/product")
@Tag(name = "Product Management", description = "APIs for managing products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/list")
    @Operation(
            summary = "Get all products",
            description = "Retrieve a paginated list of all products."
    )
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        ApiResponse<List<ProductResponse>> response = productService.getAllProducts(page, size, keyword);
        return ResponseEntity.ok(response);
    }

    @CrossOrigin
    @GetMapping("/{id}")
    @Operation(
        summary = "Get product by ID",
        description = "Retrieve a specific product by its ID."
    )
        public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        ProductResponse productResponse = ProductResponse.toProductResponse(product.get());

        ApiResponse<ProductResponse> response = new ApiResponse<>(
                "success",
                "Product retrieved successfully",
                productResponse
        );

        return ResponseEntity.ok(response);
    }
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ProductResponse>> addProduct(@RequestBody ProductRequest request) {
        ProductResponse productResponse = productService.addProduct(request);
        ApiResponse<ProductResponse> response = new ApiResponse<>(
                "created",
                "Product added successfully",
                productResponse
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/list-all")
    @Operation(
            summary = "Get all products",
            description = "Retrieve a paginated list of all products."
    )
    public ResponseEntity<ApiResponse<List<ProductNameResponse>>> getAllProducts() {
        List<ProductNameResponse> products = productService.getProductList();

        ApiResponse<List<ProductNameResponse>> response = new ApiResponse<>(
                "success",
                "Products retrieved successfully",
                products
        );

        return ResponseEntity.ok(response);
    }
}
