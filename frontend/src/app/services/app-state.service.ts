import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Product } from '../model/product.model';

@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    private mobileMenuSubject = new BehaviorSubject<boolean>(false);
    mobileMenu$ = this.mobileMenuSubject.asObservable();
    private cartLength = 0;

    private loading = false;
    private userAuthenticated = false;
    private userAdmin = false;

    controlLoading = new Subject<boolean>();
    controlCartRecovery = new Subject<number>();
    controlPagination = new Subject<{ maxPage: number, currentPage: number }>();

    private initDone = true;
    private productsTotalCount: number = 0;
    private productList: Product[] = [];

    // Add cart count subject
    private cartCount = new BehaviorSubject<number>(0);
    cartCount$ = this.cartCount.asObservable();

    constructor() {
        // Initialize the app state
        this.setInitDone(true);
    }

    isLoading(): boolean {
        return this.loading;
    }

    setLoading(loading: boolean): void {
        this.loading = loading;
    }

    setMobileMenu(value: boolean): void {
        console.log('Setting mobile menu:', value);
        this.mobileMenuSubject.next(value);
    }

    isMobileMenuOpen(): boolean {
        return this.mobileMenuSubject.value;
    }

    getCartLength(): number {
        return this.cartLength;
    }

    setCartLength(length: number): void {
        this.cartLength = length;
    }

    isUserAuth(): boolean {
        return this.userAuthenticated;
    }

    setUserAuth(auth: boolean): void {
        this.userAuthenticated = auth;
    }

    isUserAdmin(): boolean {
        // Implement your admin check logic here
        return false;
    }

    setUserAdmin(admin: boolean): void {
        this.userAdmin = admin;
    }

    isInitDone(): boolean {
        return this.initDone;
    }

    setInitDone(done: boolean): void {
        console.log('Setting init done:', done);
        this.initDone = done;
    }

    logState() {
        console.log('Auth State:', {
            isAuth: this.userAuthenticated,
            isAdmin: this.userAdmin,
            cartLength: this.cartLength,
            initDone: this.initDone
        });
    }

    getProductsTotalCount(): number {
        return this.productsTotalCount;
    }

    getProductList(): Product[] {
        return this.productList;
    }

    setProductList(products: Product[]): void {
        this.productList = products;
    }

    setProductsTotalCount(count: number): void {
        this.productsTotalCount = count;
    }

    updateCartCount(count: number) {
        console.log('Updating cart count to:', count);
        this.cartCount.next(count);
    }

    incrementCartCount() {
        const newCount = this.cartCount.value + 1;
        console.log('Incrementing cart count to:', newCount);
        this.cartCount.next(newCount);
    }
} 