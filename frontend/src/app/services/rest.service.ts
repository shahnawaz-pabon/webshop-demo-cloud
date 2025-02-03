import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';
import { AppStateService } from '../services/app-state.service';
import { environment } from '../../environments/environment';
import { PaginationUtils } from '../shared/utils/pagination.utils';
import { ActivatedRoute } from '@angular/router';


interface ProductRequestBuilder {
    getProducts: (page: number, size?: number) => Observable<HttpResponse<any>>;
    deleteProductById: (productId: number) => Observable<HttpResponse<{ productId: number }>>;
}

interface ProductResponseHandler {
    getProducts_OK: (response: HttpResponse<any>) => void;
    getProducts_ERROR: (error: any) => void;
    deleteProductById_OK: (response: HttpResponse<{ productId: number }>) => void;
    deleteProductById_ERROR: (error: any) => void;
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
            getProducts: (page: number, size: number = 10): Observable<HttpResponse<any>> => {
                return this.http.get<any>(
                    `${this.baseUrl}/product/list?page=${page}&size=${size}`,
                    {
                        observe: 'response',
                        headers: { 'Accept': 'application/json' }
                    }
                );
            },
            deleteProductById: (productId: number) =>
                this.http.delete<{ productId: number }>(`${this.baseUrl}/products/${productId}`, { observe: 'response' })
        };
    }

    getProductResponseHandler(): ProductResponseHandler {
        return {
            getProducts_OK: (response: HttpResponse<any>) => {
                const products = response.body.data.map((item: any) =>
                    new Product(
                        item.productId,
                        item.title,
                        item.summary,
                        item.price,
                        item.description,
                        item.imageUrl
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


} 