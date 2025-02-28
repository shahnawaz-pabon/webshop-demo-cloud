import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface InventoryPayload {
    productId: number;
    supplierId: number;
    stockLevel: number;
    inventoryId?: number;
}

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    private apiUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    upsertInventory(inventoryData: {
        productId: string,
        quantity: number,
        supplierId: string,
        inventoryId?: number
    }): Observable<any> {
        // Transform the data to match API requirements
        const payload: InventoryPayload = {
            productId: parseInt(inventoryData.productId),
            supplierId: parseInt(inventoryData.supplierId),
            stockLevel: inventoryData.quantity  
        };

        if (inventoryData.inventoryId) {
            payload.inventoryId = inventoryData.inventoryId;
        }

        return this.http.post(`${this.apiUrl}/inventory/upsert`, payload);
    }

    deleteInventory(inventoryId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/inventory/${inventoryId}`);
    }
} 