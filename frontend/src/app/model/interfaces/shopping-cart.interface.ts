import { BaseResponse } from './base-response.interface';
import { CartItem } from './cart-item.interface';

// Base interface for cart data
export interface CartData {
    cart: CartItem[];
    totalPrice: number;
    totalLength?: number;
}

// Response interface that extends BaseResponse with CartData
export interface ShoppingCart extends BaseResponse<CartData> { } 