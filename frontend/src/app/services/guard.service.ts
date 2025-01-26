import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GuardService {
    private subscriptions: Subscription[] = [];

    constructor() { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        return true; // Add your guard logic here
    }

    addSubscriptionFromOutside(subscription: Subscription): void {
        this.subscriptions.push(subscription);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
} 