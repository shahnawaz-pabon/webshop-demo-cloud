import { CartItem } from './cart-item.interface';
import { UserData } from './user-data.interface';
import { ShoppingCart } from './shopping-cart.interface';

export interface Order extends ShoppingCart {
    orderId: number;
    formattedDate: string;
    formattedTime: string;
    status: string;
    orderNumber: string;
    userData: UserData;
} 