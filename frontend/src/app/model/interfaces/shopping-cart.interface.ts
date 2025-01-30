import { CartItem } from './cart-item.interface';

export interface ShoppingCart {
    cart: CartItem[];
    totalPrice: number;
    totalLength?: number;
} 