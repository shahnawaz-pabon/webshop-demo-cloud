package com.cloud.webshop.controller;

import com.cloud.webshop.model.Inventory;
import com.cloud.webshop.model.Product;
import com.cloud.webshop.request.InventoryRequest;
import com.cloud.webshop.response.ApiResponse;
import com.cloud.webshop.response.InventoryResponse;
import com.cloud.webshop.response.ProductResponse;
import com.cloud.webshop.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/inventory")
@Tag(name = "Inventory Management", description = "APIs for managing product inventories")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping("/{inventoryId}")
    @Operation(
            summary = "Get a product",
            description = "Getting a product from the inventory"
    )
    public ResponseEntity<ApiResponse<InventoryResponse>> getInventoryById(@PathVariable Long inventoryId) {
        InventoryResponse inventory = inventoryService.getInventoryById(inventoryId);
        ApiResponse<InventoryResponse> response = new ApiResponse<>(
                "success",
                "Inventory fetched successfully",
                inventory
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/list")
    @Operation(
            summary = "Get product list",
            description = "Getting product list from the inventory"
    )
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getAllInventory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        // Create a Pageable object for pagination
        Pageable pageable = PageRequest.of(page, size);

        // Fetch paginated inventory list
        Page<Inventory> inventoryPage = inventoryService.getAllInventory(pageable);

        // Convert inventories to DTOs
        List<InventoryResponse> products = inventoryPage.getContent().stream()
                .map(InventoryResponse::mapToInventoryResponse)
                .collect(Collectors.toList());

        // Create the response with pagination details
        ApiResponse<List<InventoryResponse>> response = new ApiResponse<>(
                "success",
                "Inventory retrieved successfully",
                products,
                inventoryPage.getNumber(),      // Current page number
                inventoryPage.getSize(),        // Page size
                inventoryPage.getTotalPages(),  // Total pages
                inventoryPage.getTotalElements() // Total items
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    @Operation(
            summary = "Create or update a product's inventory",
            description = "Create or update a product's inventory"
    )
    public ResponseEntity<ApiResponse<InventoryResponse>> saveOrUpdateInventory(@RequestBody InventoryRequest request) {
        InventoryResponse inventoryResponse = inventoryService.saveOrUpdateInventory(request);
        ApiResponse<InventoryResponse> response = new ApiResponse<>(
                "Ok",
                request.getInventoryId() != null ? "Inventory updated successfully" : "Inventory created successfully",
                inventoryResponse
        );
        return ResponseEntity.ok(response);
    }
}
