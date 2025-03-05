import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppStateService } from '../../../services/app-state.service';
import { ProductItemComponent } from '../product-item/product-item.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { GuardService } from '../../../services/guard.service';
import { Subscription, Subject } from 'rxjs';
import { PaginationUtils } from '../../../shared/utils/pagination.utils';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Product } from '../../../model/product.model';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    ProductItemComponent,
    PaginationComponent,
    FormsModule
  ]
})
export class ProductListComponent implements OnInit, AfterViewInit, OnDestroy {

  title: string = '';

  componentLoaded: boolean = false;

  subscriptions: Subscription[] = [];

  searchKeyword: string = '';
  isAvailable: boolean = false;

  minPrice: number = 0;
  maxPrice: number = 1000;
  pageNumber: number = 0;
  isSearching: boolean = false;

  private priceChangeSubject = new Subject<void>();

  constructor(
    public appState: AppStateService,
    private pageTitle: Title,
    private guardService: GuardService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    // Initialize cart count
    this.cartService.getCart().subscribe((data) => {
      const totalQuantity = data.data.cart
        .map(item => item.quantity)
        .reduce((acc, curr) => acc + curr, 0);
      this.appState.updateCartCount(totalQuantity);
    });

    // set title
    this.setTitles();
    const sub = this.activatedRoute.queryParams.subscribe(
      (queryParams: Params) => {
        console.log('queryParams', queryParams);
        this.pageNumber = queryParams['page'];
      }
    );
    this.subscriptions.push(sub);

    // load initial products (page 1) with isAvailable as undefined
    const productSub = this.guardService.loadProducts(
      this.pageNumber - 1,
      this.appState.isUserAdmin(),
      undefined,
      undefined
    ).subscribe({
      next: (response) => {
        if (response.body) {
          console.log('Body content:', response.body.content);
        }
        this.handleResponse(response.body);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
    this.subscriptions.push(productSub);

    // listen on query params (selected page)
    this.handleSelectedPage();

    this.priceChangeSubject.pipe(
      debounceTime(500)  // Wait 500ms after last change
    ).subscribe(() => {
      this.executeSearch();
    });
  }

  ngAfterViewInit(): void {
    //stop page loading
    window.setTimeout(() => this.appState.controlLoading.next(false), 0);

    //component
    this.componentLoaded = true;
  }

  handleSelectedPage() {
    const sub = this.activatedRoute.queryParams.subscribe(
      (queryParams: Params) => {
        if (this.componentLoaded) {
          const page = PaginationUtils.getSelectedPage(queryParams);

          const productSub = this.guardService.loadProducts(
            page,
            this.appState.isUserAdmin(),
            this.searchKeyword,
            this.isAvailable ? true : undefined
          ).subscribe({
            next: (response) => {
              this.handleResponse(response.body);
            }
          });
          this.guardService.addSubscriptionFromOutside(productSub);
        }
      }
    );
    this.subscriptions.push(sub);
  }

  setTitles() {
    if (this.appState.isUserAdmin()) {
      this.title = 'Manage Products';
    } else {
      this.title = '';
    }
    this.pageTitle.setTitle('Products');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  handleResponse(response: any) {
    // console.log('=== Response Debug ===');
    // console.log('Raw response:', response);

    if (response && response.data) {
      const products = response.data.map((item: any) => new Product(
        item.productId,
        item.title,
        item.summary,
        item.price,
        item.description,
        item.imageUrl,
        item.quantity,
        item.inventoryId,
        item.supplierId
      ));

      // console.log('Mapped products:', products);
      this.appState.setProductList(products);

      // Update pagination and total count
      this.appState.setProductsTotalCount(response.totalItems);
      this.appState.controlPagination.next({
        maxPage: response.totalPages,
        currentPage: response.page
      });
    } else {
      console.warn('Invalid response structure');
      this.appState.setProductList([]);
    }
  }

  toggleAvailable() {
    this.isAvailable = !this.isAvailable;
  }

  executeSearch() {
    this.isSearching = true;
    const page = 0;
    const availableFlag = this.isAvailable ? true : undefined;

    this.guardService.loadProducts(
      page,
      this.appState.isUserAdmin(),
      this.searchKeyword,
      availableFlag
    ).subscribe({
      next: (response) => {
        this.handleResponse(response.body);
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isSearching = false;
      }
    });
  }

  updateSlider(event: Event) {
    const input = event.target as HTMLInputElement;
    const isMinSlider = input.classList.contains('min-price');

    if (this.minPrice > this.maxPrice) {
      if (isMinSlider) {
        this.maxPrice = this.minPrice;
      } else {
        this.minPrice = this.maxPrice;
      }
    }

    this.priceChangeSubject.next();
  }

  // Add a method to handle checkbox changes
  onAvailableChange() {
    this.executeSearch();
  }

}