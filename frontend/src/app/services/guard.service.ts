import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { RestService } from './rest.service';

@Injectable({
    providedIn: 'root'
})
export class GuardService {
    private outsideSubscriptions: Subscription[] = [];

    constructor(private restService: RestService) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        return true; // Add your guard logic here
    }

    loadProducts(page: number, isAdmin: boolean, keyword?: string, isAvailable: boolean = true): Observable<any> {
        const requestObservable = this.restService.getProductRequestBuilder()
            .getProducts(page, 1000, keyword, isAvailable);
        const responseHandler = this.restService.getProductResponseHandler();

        requestObservable.subscribe({
            next: (response) => responseHandler.getProducts_OK(response),
            error: (error) => responseHandler.getProducts_ERROR(error)
        });

        return requestObservable;
    }

    addSubscriptionFromOutside(subscription: Subscription): void {
        this.outsideSubscriptions.push(subscription);
    }

    clearSubscriptions(): void {
        this.outsideSubscriptions.forEach(sub => sub.unsubscribe());
        this.outsideSubscriptions = [];
    }
} 