package com.cloud.webshop.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class InventoryRequest {
    private Long inventoryId; // Optional: Required for update
    private Long productId;
    private Long supplierId;
    private int stockLevel;
}
