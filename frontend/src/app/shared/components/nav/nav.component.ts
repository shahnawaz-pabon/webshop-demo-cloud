import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppStateService } from '../../../services/app-state.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-nav',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit, OnDestroy {
    cartCount$ = this.appState.cartCount$;
    private subscription: Subscription = new Subscription();

    constructor(private appState: AppStateService) { }

    ngOnInit() {
        // Initialize cart count to 0
        this.appState.updateCartCount(0);
        
        // Subscribe to cart count changes
        this.subscription.add(
            this.cartCount$.subscribe(count => {
                console.log('Current cart count:', count);
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
} 