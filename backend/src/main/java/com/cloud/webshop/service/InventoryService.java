package com.cloud.webshop.service;

import com.cloud.webshop.model.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InventoryService {
    Page<Inventory> getAllInventory(Pageable pageable);
}