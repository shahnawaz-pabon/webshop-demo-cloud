import { NgIf, NgStyle } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { RestService } from '../../../services/rest.service';
import { Product } from '../../../model/product.model';
import { FormatPricePipe } from '../../../pipes/format-price.pipe';
import { DeleteIconComponent } from '../../../shared/icons/delete-icon/delete-icon.component';
import { EditIconComponent } from '../../../shared/icons/edit-icon/edit-icon.component';
import { AppStateService } from '../../../services/app-state.service';
import { PaginationUtils } from '../../../shared/utils/pagination.utils';
@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    RouterLink,
    FormatPricePipe,
    EditIconComponent,
    DeleteIconComponent
  ]
})
export class ProductItemComponent implements OnDestroy {

  @Input()
  product!: Product;

  subscription: Subscription[] = [];

  constructor(
    public appState: AppStateService,
    private restService: RestService
  ) { }

  deleteProduct() {
    const productId = this.product.getProductId();

    //create request
    const requestObservable = this.restService.getProductRequestBuilder().deleteProductById(productId);
    const responseHandler = this.restService.getProductResponseHandler();

    //start loading
    this.appState.controlLoading.next(true);

    //send request
    const sub = requestObservable.subscribe({

      next: (httpResponse: HttpResponse<{ productId: number }>) => {
        responseHandler.deleteProductById_OK(httpResponse);
      },

      error: (httpErrorResponse: HttpErrorResponse) => {
        responseHandler.deleteProductById_ERROR(httpErrorResponse);
      }

    });

    //save subs
    this.subscription.push(sub);
  }

  getCursorStyle(): string {
    return this.appState.isUserAdmin() ? 'auto' : 'pointer';
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
