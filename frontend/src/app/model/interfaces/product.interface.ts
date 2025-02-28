export interface Product {
    productId: number;
    title: string;
    summary: string;
    price: number;
    description: string;
    imageUrl: string;
} 
export interface ProductResponse {
    data: Product[];
    page: number;
    totalItems: number;
    totalPages: number;
}
