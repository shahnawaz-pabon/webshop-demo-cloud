import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { RestService } from './rest.service';
import { ProductListResponse } from '../model/interfaces/product.interface';

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
            // Initial load - use default pagination and isAvailable=false
            return this.http.get<ProductListResponse>(
                `${this.apiUrl}/product/list?page=${page}&size=10&isAvailable=false`, {
                observe: 'response',
                headers: this.restService.getHeaders(isAdmin)
            });
        } else {
            // Search functionality - use search parameters
            let url = `${this.apiUrl}/product/list?page=${page}&size=10`;

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