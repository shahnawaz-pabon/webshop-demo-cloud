import { BaseResponse } from './base-response.interface';
import { Product } from './product.interface';

export interface CartItem {
    product: Product;
    quantity: number;
    totalPrice: number;
}

export interface CartItemResponse extends BaseResponse<CartItem> { }