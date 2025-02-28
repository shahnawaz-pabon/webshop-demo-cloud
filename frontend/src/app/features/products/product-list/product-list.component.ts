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
  isAvailable: boolean = true;

  minPrice: number = 0;
  maxPrice: number = 1000;

  isSearching: boolean = false;

  private priceChangeSubject = new Subject<void>();

  constructor(
    public appState: AppStateService,
    private pageTitle: Title,
    private guardService: GuardService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // set title
    this.setTitles();

    // load initial products (page 1)
    const productSub = this.guardService.loadProducts(0, this.appState.isUserAdmin()).subscribe({
      next: (response) => {
        console.log('Full response:', response); // Log the full response
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

          const productSub = this.guardService.loadProducts(page, false).subscribe();
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
    const totalPages = response.totalPages;
    const currentPage = response.page;
    console.log('Total pages: ki eikhan theke set hoitese');
    this.appState.controlPagination.next({
      maxPage: totalPages,
      currentPage: currentPage
    });
  }

  toggleAvailable() {
    this.isAvailable = !this.isAvailable;
  }

  executeSearch() {
    this.isSearching = true;
    const page = 0;
    this.guardService.loadProducts(page, this.appState.isUserAdmin(), this.searchKeyword, this.isAvailable)
      .subscribe({
        next: (response) => {
          console.log('Search response:', response);
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

}