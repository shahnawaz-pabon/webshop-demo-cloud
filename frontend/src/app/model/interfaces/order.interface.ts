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
  shipmentStatus: string;
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

// New interface for order history response
export interface OrderHistoryResponse {
  status: string;
  message: string;
  data: Order[];
  page: number;
  size: number;
  totalPages: number;
  totalItems: number;
}

export interface OrderProduct {
  id: OrderProductId;
  order: string;
  product: Product;
  quantity: number;
}

export interface OrderProductId {
  orderId: number;
  productId: number;
}

export interface Inventory {
  inventoryId: number;
  product: string;
  supplier: Supplier;
  stockLevel: number;
}

export interface Supplier {
  supplierId: number;
  name: string;
  contactInfo: string;
  inventories: string[];
}

export interface Cart {
  cartId: number;
  userId: number;
  product: string;
  quantity: number;
}

// New interfaces for create order response
export interface CreateOrderResponse {
  status: string;
  message: string;
  data: CreateOrderData;
}

export interface CreateOrderData {
  orderId: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  paymentStatus: string;
  orderProducts: CreateOrderProduct[];
}

export interface CreateOrderProduct {
  id: OrderProductId;
  order: string;
  product: CreateOrderProductDetails;
  quantity: number;
}

export interface CreateOrderProductDetails {
  productId: number;
  title: string;
  description: string;
  summary: string;
  price: number;
  imageUrl: string;
  inventories: CreateOrderInventory[];
  orderProducts: string[];
  carts: CreateOrderCart[];
}

export interface CreateOrderInventory {
  inventoryId: number;
  product: string;
  supplier: CreateOrderSupplier;
  stockLevel: number;
}

export interface CreateOrderSupplier {
  supplierId: number;
  name: string;
  contactInfo: string;
  inventories: string[];
}

export interface CreateOrderCart {
  cartId: number;
  userId: number;
  product: string;
  quantity: number;
} 