import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface InventoryPayload {
    productId: number;
    supplierId: number;
    stockLevel: number;
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
        supplier: string
    }): Observable<any> {
        // Transform the data to match API requirements
        const payload: InventoryPayload = {
            productId: parseInt(inventoryData.productId),
            supplierId: parseInt(inventoryData.supplier),
            stockLevel: inventoryData.quantity
        };

        return this.http.post(`${this.apiUrl}/inventory/upsert`, payload);
    }
} 