package com.cloud.webshop.response;

import com.cloud.webshop.model.Inventory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryResponse {
    private Long inventoryId;
    private Long productId;
    private String productTitle;
    private Long supplierId;
    private String supplierName;
    private int stockLevel;

    public static InventoryResponse mapToInventoryResponse(Inventory inventory) {
        InventoryResponse response = new InventoryResponse();
        response.setInventoryId(inventory.getInventoryId());
        response.setProductId(inventory.getProduct().getProductId());
        response.setProductTitle(inventory.getProduct().getTitle());
        response.setSupplierId(inventory.getSupplier().getSupplierId());
        response.setSupplierName(inventory.getSupplier().getName());
        response.setStockLevel(inventory.getStockLevel());
        return response;
    }
}
