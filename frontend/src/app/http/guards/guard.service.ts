import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class GuardService {
    constructor() { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        return true; // Add your guard logic here
    }
} 