import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ErrorsHandlingService {
    constructor(private router: Router) { }

    navigateToErrorPage(errorCode: string) {
        this.router.navigate(['/error', errorCode]);
    }
} 