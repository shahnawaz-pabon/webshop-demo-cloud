package com.cloud.webshop.controller;

import com.cloud.webshop.model.Supplier;
import com.cloud.webshop.response.ApiResponse;
import com.cloud.webshop.response.SupplierResponse;
import com.cloud.webshop.service.SupplierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/supplier")
@Tag(name = "Supplier Management", description = "APIs for managing suppliers")
public class SupplierController {
    @Autowired
    private SupplierService supplierService;

    @GetMapping("/list")
    @Operation(
            summary = "Get suppliers list",
            description = "Retrieve a paginated list of all suppliers."
    )
    public ResponseEntity<ApiResponse<List<SupplierResponse>>> getAllSuppliers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        // Create a Pageable object for pagination
        Pageable pageable = PageRequest.of(page, size);

        // Fetch paginated suppliers
        Page<Supplier> supplierPage = supplierService.getAllSuppliers(pageable);

        // Convert suppliers to DTOs
        List<SupplierResponse> products = supplierPage.getContent().stream()
                .map(SupplierResponse::toSupplierResponse)
                .collect(Collectors.toList());

        // Create the response with pagination details
        ApiResponse<List<SupplierResponse>> response = new ApiResponse<>(
                "success",
                "Suppliers fetched successfully",
                products,
                supplierPage.getNumber(),      // Current page number
                supplierPage.getSize(),        // Page size
                supplierPage.getTotalPages(),  // Total pages
                supplierPage.getTotalElements() // Total items
        );

        return ResponseEntity.ok(response);
    }
}