import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';
import { AppStateService } from '../services/app-state.service';
import { environment } from '../../environments/environment';
import { PaginationUtils } from '../shared/utils/pagination.utils';
import { ActivatedRoute } from '@angular/router';
import { CartItemResponse } from '../model/interfaces/cart-item.interface';
import { CartItem } from '../model/cart-item.model';
import { ShoppingCart } from '../model/shopping-cart.model';
import { SupplierResponse, SupplierListResponse } from '../model/interfaces/supplier.interface';
import { ProductResponse, ProductListResponse } from '../model/interfaces/product.interface';
import { InventoryUpsertRequest } from '../model/interfaces/inventory.interface';


interface ProductRequestBuilder {
    getProducts: (page: number, size?: number, keyword?: string, isAvailable?: boolean) => Observable<HttpResponse<any>>;
    deleteProductById: (productId: number) => Observable<HttpResponse<{ productId: number }>>;
}

interface ProductResponseHandler {
    getProducts_OK: (response: HttpResponse<any>) => void;
    getProducts_ERROR: (error: any) => void;
    deleteProductById_OK: (response: HttpResponse<{ productId: number }>) => void;
    deleteProductById_ERROR: (error: any) => void;
}

interface CartRequestBuilder {
    postCartItem: (cartItem: any) => Observable<HttpResponse<CartItemResponse>>;
    getCartList: () => Observable<HttpResponse<ShoppingCart>>;
    deleteCartItem: (cartItemId: number) => Observable<HttpResponse<{ cartItemId: number }>>;
}

interface CartResponseHandler {
    postCartItem_OK: (response: HttpResponse<CartItemResponse>) => void;
    postCartItem_ERROR: (error: any) => void;
    getCartList_OK: (response: HttpResponse<any>) => void;
    getCartList_ERROR: (error: any) => void;
}

@Injectable({
    providedIn: 'root'
})
export class RestService {
    private baseUrl = environment.apiBaseUrl;

    constructor(
        private http: HttpClient,
        private appState: AppStateService,
        private activatedRoute: ActivatedRoute,

    ) { }

    getAuthRequestBuilder() {
        return {
            postLogout: (): Observable<HttpResponse<void>> => {
                return this.http.post<void>('/api/auth/logout', {}, { observe: 'response' });
            }
        };
    }

    getAuthResponseHandler() {
        return {
            postLogout_OK: (response: HttpResponse<void>) => {
                // Handle successful logout
            },
            postLogout_ERROR: (error: any) => {
                // Handle logout error
            }
        };
    }

    getFlashingRequestBuilder() {
        return {
            flashCart: (dataId: number): Observable<HttpResponse<void>> => {
                return this.http.post<void>(`/api/cart/flash/${dataId}`, {}, { observe: 'response' });
            }
        };
    }

    getFlashingResponseHandler() {
        return {
            flashCart_OK: (response: HttpResponse<void>) => {
                // Handle successful cart flash
            },
            flashCart_ERROR: (error: any) => {
                // Handle cart flash error
            }
        };
    }

    getProductRequestBuilder(): ProductRequestBuilder {
        return {
            getProducts: (page: number, size: number = 10, keyword?: string, isAvailable: boolean = true): Observable<HttpResponse<any>> => {
                let url = `${this.baseUrl}/product/list?page=${page}&size=${size}`;

                if (keyword) {
                    url += `&keyword=${keyword}`;
                }
                if (isAvailable) {
                    url += `&isAvailable=${isAvailable}`;
                }

                return this.http.get<any>(url, {
                    observe: 'response',
                    headers: { 'Accept': 'application/json' }
                });
            },
            deleteProductById: (productId: number) =>
                this.http.delete<{ productId: number }>(`${this.baseUrl}/product/${productId}`, { observe: 'response' })
        };
    }

    getProductResponseHandler(): ProductResponseHandler {
        return {
            getProducts_OK: (response: HttpResponse<any>) => {
                const products = response.body?.data?.map((item: any) =>
                    //  const products = response?.body.map((item: any) =>
                    new Product(
                        item.productId,
                        item.title,
                        item.summary,
                        item.price,
                        item.description,
                        item.imageUrl,
                        item.quantity,
                        item.inventoryId,
                        item.supplierId
                    )
                );
                this.appState.setProductList(products);
                // Set a fixed total count for testing (replace with actual count from your API)
                this.appState.setProductsTotalCount(24); // This will show 3 pages with 8 items each

                // Trigger pagination update
                const currentPage = 0; // Get this from your current state
                PaginationUtils.emitPaginationConfig(
                    currentPage,
                    this.appState.getProductsTotalCount(),
                    this.appState.controlPagination
                );
            },
            getProducts_ERROR: (error: any) => {
                console.error('Failed to fetch products:', error);
            },
            deleteProductById_OK: (response) => { },
            deleteProductById_ERROR: (error: any) => { }
        };
    }

    getProducts(page: number, itemsPerPage: number): Observable<Product[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', itemsPerPage.toString());

        return this.http.get<Product[]>(`${this.baseUrl}/product/list`, { params });
    }

    getCartRequestBuilder(): CartRequestBuilder {
        return {
            postCartItem: (cartItem: any): Observable<HttpResponse<CartItemResponse>> => {
                return this.http.post<CartItemResponse>(
                    `${this.baseUrl}/cart/add`,
                    cartItem,
                    { observe: 'response' }
                );
            },
            getCartList: (): Observable<HttpResponse<ShoppingCart>> => {
                return this.http.get<ShoppingCart>(
                    `${this.baseUrl}/cart/list?userId=1`,  // Add userId parameter
                    { observe: 'response' }
                );
            },
            deleteCartItem: (cartItemId: number): Observable<HttpResponse<{ cartItemId: number }>> => {
                return this.http.delete<{ cartItemId: number }>(
                    `${this.baseUrl}/cart/${cartItemId}`,
                    { observe: 'response' }
                );
            }
        };
    }

    getCartResponseHandler(): CartResponseHandler {
        return {
            postCartItem_OK: (response: HttpResponse<CartItemResponse>) => {
                console.log('Cart item added successfully');
                this.appState.incrementCartCount();
                this.appState.controlLoading.next(false);
            },
            postCartItem_ERROR: (error: any) => {
                console.error('Failed to save cart item:', error);
                this.appState.controlLoading.next(false);
            },
            getCartList_OK: (response: HttpResponse<any>) => {
                this.appState.controlLoading.next(false);
                // Convert raw data to ShoppingCart instance
                if (response.body) {
                    const cartItems = response.body.cart.map((item: any) =>
                        new CartItem(
                            item.product,
                            item.quantity,
                            item.totalPrice
                        )
                    );
                    return new ShoppingCart(
                        cartItems,
                        response.body.totalPrice,
                        //    response.body.totalLength
                    );
                }
                return null;
            },
            getCartList_ERROR: (error: any) => {
                console.error('Failed to fetch cart list:', error);
                this.appState.controlLoading.next(false);
            }
        };
    }

    getApiUrl(): string {
        return this.baseUrl;
    }

    getHeaders(isAdmin: boolean): HttpHeaders {
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json');

        // Add any auth tokens or other headers if needed
        // For example:
        // if (isAdmin) {
        //     headers = headers.set('Authorization', `Bearer ${this.getAdminToken()}`);
        // }

        return headers;
    }

    getSupplierList(page: number, size: number): Observable<HttpResponse<SupplierListResponse>> {
        return this.http.get<SupplierListResponse>(
            `${this.baseUrl}/supplier/list?page=${page}&size=${size}`,
            { observe: 'response' }
        );
    }

    getAllProducts(): Observable<HttpResponse<ProductListResponse>> {
        return this.http.get<ProductListResponse>(
            `${this.baseUrl}/product/list-all`,
            { observe: 'response' }
        );
    }

    getProductById(productId: number): Observable<HttpResponse<ProductResponse>> {
        return this.http.get<ProductResponse>(
            `${this.baseUrl}/product/${productId}`,
            { observe: 'response' }
        );
    }

    upsertInventory(request: InventoryUpsertRequest): Observable<HttpResponse<any>> {
        return this.http.post<any>(
            `${this.baseUrl}/inventory/upsert`,
            request,
            { observe: 'response' }
        );
    }
} 