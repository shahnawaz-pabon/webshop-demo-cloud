package com.cloud.webshop.service.impl;

import com.cloud.webshop.model.Inventory;
import com.cloud.webshop.repository.InventoryRepository;
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
}
