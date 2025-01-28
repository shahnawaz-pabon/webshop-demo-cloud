import { NgForOf, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppStateService } from '../../../services/app-state.service';
import { PaginationUtils } from '../../../shared/utils/pagination.utils';

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

  constructor(
    private appState: AppStateService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.handlePaginationConfig();
    this.setPaginationConfig();
  }

  handlePaginationConfig() {
    const sub = this.appState.controlPagination.subscribe(
      (paginationConfig: { maxPage: number, currentPage: number }) => {
        console.log('Pagination config:', paginationConfig); // Debug log
        this.maxPage = paginationConfig.maxPage;
        this.currentPage = paginationConfig.currentPage;
      }
    );

    this.subscriptions.push(sub);
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
    return Array(this.maxPage - 1).fill(0).map((_, i) => i);
  }

  getPageQueryParam(page: number): { page: number } {
    return { page };
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
