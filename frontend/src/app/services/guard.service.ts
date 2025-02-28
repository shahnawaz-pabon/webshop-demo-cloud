import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { RestService } from './rest.service';
import { ProductResponse } from '../model/interfaces/product.interface';

@Injectable({
    providedIn: 'root'
})
export class GuardService {
    private outsideSubscriptions: Subscription[] = [];
    private apiUrl: string;

    constructor(private restService: RestService, private http: HttpClient) {
        this.apiUrl = this.restService.getApiUrl();
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        return true; // Add your guard logic here
    }

    loadProducts(page: number, isAdmin: boolean, searchKeyword?: string, isAvailable?: boolean): Observable<any> {
        // Different URL and parameters for initial load vs search
        if (!searchKeyword && isAvailable === undefined) {
            // Initial load - use default pagination
            return this.http.get<ProductResponse>(`${this.apiUrl}/product/list?page=${page}&size=10`, {
                observe: 'response',
                headers: this.restService.getHeaders(isAdmin)
            }).pipe(
                map(response => {

                    const body = response.body as ProductResponse;
                    return {
                        ...response,
                        body: {
                            content: body.data,
                            totalElements: body.totalItems,
                            totalPages: body.totalPages,
                            page: body.page
                        }
                    };
                })
            );
        } else {
            // Search functionality - use search parameters
            let url = `${this.apiUrl}/products/list?page=${page}&size=1000`;

            if (searchKeyword) {
                url += `&keyword=${searchKeyword}`;
            }

            if (isAvailable === true) {
                url += `&isAvailable=true`;
            }

            return this.http.get(url, {
                observe: 'response',
                headers: this.restService.getHeaders(isAdmin)
            });
        }
    }

    addSubscriptionFromOutside(subscription: Subscription): void {
        this.outsideSubscriptions.push(subscription);
    }

    clearSubscriptions(): void {
        this.outsideSubscriptions.forEach(sub => sub.unsubscribe());
        this.outsideSubscriptions = [];
    }
} 