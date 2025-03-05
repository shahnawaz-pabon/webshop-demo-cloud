export interface InventoryUpsertRequest {
    inventoryId: number;
    productId: number;
    supplierId: number;
    stockLevel: number;
} 