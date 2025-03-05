import { NgForOf, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppStateService } from '../../../services/app-state.service';
import { PaginationUtils } from '../../../shared/utils/pagination.utils';
import { RestService } from '../../../services/rest.service';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink
  ]
})
export class PaginationComponent implements OnInit, OnDestroy {

  maxPage: number = 1;

  currentPage: number = 1;

  subscriptions: Subscription[] = [];

  products: any[] = [];



  constructor(
    private appState: AppStateService,
    private activatedRoute: ActivatedRoute,
    private restService: RestService
  ) { }

  ngOnInit(): void {
    this.handlePaginationConfig();
    this.setPaginationConfig();
    this.loadProducts();
  }

  handlePaginationConfig() {
    const sub = this.appState.controlPagination.subscribe(
      (paginationConfig: { maxPage: number, currentPage: number }) => {
        console.log('Pagination config:', paginationConfig); // Debug log
        this.maxPage = paginationConfig.maxPage;
        this.currentPage = paginationConfig.currentPage + 1;
      }
    );

    this.subscriptions.push(sub);
  }

  onNextPage() {
    if (this.currentPage < this.maxPage) {
      console.log('Next page:', this.currentPage);
      this.currentPage++;
      this.updatePage();
      this.loadProducts();
    }
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      console.log('Previous page:', this.currentPage);
      this.currentPage--;
      this.updatePage();
      this.loadProducts();
    }
  }

  updatePage() {
    console.log('when do you call this? updatePage', this.currentPage);
    PaginationUtils.emitPaginationConfig(
      this.currentPage,
      this.appState.getProductsTotalCount(),
      this.appState.controlPagination
    );
  }

  setPaginationConfig() {
    const page = PaginationUtils.getSelectedPage(this.activatedRoute.snapshot.queryParams);
    PaginationUtils.emitPaginationConfig(
      page,
      this.appState.getProductsTotalCount(),
      this.appState.controlPagination
    );
  }

  getArrayOfPages(): number[] {
    return Array(this.maxPage).fill(0).map((_, i) => i + 1);
  }

  getPageQueryParam(page: number): { page: number } {
    return { page };
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  handleResponse(response: any) {
    const totalPages = response.totalPages;
    const currentPage = response.page;

    this.appState.controlPagination.next({
      maxPage: totalPages,
      currentPage: currentPage
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      console.log('Ctrl+K detected: triggering onNextPage()');
      this.onNextPage();
    }
  }

  loadProducts(): void {
    console.log('loadProducts', this.currentPage);

    this.restService.getProductRequestBuilder().getProducts(this.currentPage - 1, 10)
      .subscribe(
        response => {
          console.log('loadProducts', this.currentPage);
          const products = response.body.data;
          this.products = products;
          this.maxPage = response.body.totalPages;
          console.log(`Loaded page ${this.currentPage}:`, this.products);
        },
        error => {
          console.error('Error loading products: ', error);
        }
      );
  }

}
