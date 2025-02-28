package com.cloud.webshop.service;

import com.cloud.webshop.model.Inventory;
import com.cloud.webshop.request.InventoryRequest;
import com.cloud.webshop.response.InventoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InventoryService {
    InventoryResponse getInventoryById(Long inventoryId);
    Page<Inventory> getAllInventory(Pageable pageable);
    InventoryResponse saveOrUpdateInventory(InventoryRequest inventoryRequest);
    void deleteInventory(Long inventoryId);
}