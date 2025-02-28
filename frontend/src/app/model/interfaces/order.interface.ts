export interface Product {
  productId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  quantity: number;
  inventoryId: number | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
  cartId: number;
}

export interface Order {
  cart: CartItem[];
  totalPrice: number;
  totalLength: number;
  orderId: number;
  formattedDate: string;
  formattedTime: string;
  status: string;
  orderNumber: string | null;
  userData: any | null;
}

export interface OrderResponse {
  status: string;
  message: string;
  data: Order[];
  page: number;
  size: number;
  totalPages: number;
  totalItems: number;
} 