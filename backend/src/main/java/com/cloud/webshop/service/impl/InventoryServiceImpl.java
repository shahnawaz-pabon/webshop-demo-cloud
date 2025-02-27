package com.cloud.webshop.service.impl;

import com.cloud.webshop.model.Inventory;
import com.cloud.webshop.model.Product;
import com.cloud.webshop.model.Supplier;
import com.cloud.webshop.repository.InventoryRepository;
import com.cloud.webshop.repository.ProductRepository;
import com.cloud.webshop.repository.SupplierRepository;
import com.cloud.webshop.request.InventoryRequest;
import com.cloud.webshop.response.InventoryResponse;
import com.cloud.webshop.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class InventoryServiceImpl implements InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    public InventoryResponse getInventoryById(Long inventoryId) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        return InventoryResponse.mapToInventoryResponse(inventory);
    }

    @Override
    public Page<Inventory> getAllInventory(Pageable pageable) {
        return inventoryRepository.findAll(pageable);
    }

    @Override
    public InventoryResponse saveOrUpdateInventory(InventoryRequest request) {
        // Check if the product and supplier exist
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Inventory inventory;
        if (request.getInventoryId() != null) {
            // Update existing inventory
            inventory = inventoryRepository.findById(request.getInventoryId())
                    .orElseThrow(() -> new RuntimeException("Inventory not found"));
            inventory.setStockLevel(request.getStockLevel());
        } else {
            // Create new inventory
            inventory = new Inventory();
            inventory.setProduct(product);
            inventory.setSupplier(supplier);
            inventory.setStockLevel(request.getStockLevel());
        }

        Inventory savedInventory = inventoryRepository.save(inventory);
        return InventoryResponse.mapToInventoryResponse(savedInventory);
    }
}
