import { BaseResponse } from './base-response.interface';

export interface Product {
    productId: number;
    title: string;
    summary: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
    quantity?: number;
    inventoryId?: number;
}

export interface ProductResponse extends BaseResponse<Product> { }
export interface ProductListResponse extends BaseResponse<Product[]> { }
