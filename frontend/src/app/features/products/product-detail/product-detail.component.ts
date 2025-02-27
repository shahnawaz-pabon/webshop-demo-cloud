import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Product } from '../../../model/product.model';
import { AppStateService } from '../../../services/app-state.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ErrorsHandlingService } from '../../../services/errors-handling.service';
import { RestService } from '../../../services/rest.service';
import { CartItem } from '../../../model/cart-item.model';
import { ProductUtils } from '../../../shared/utils/product.utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export class ProductDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  product: Product;

  subscriptions: Subscription[] = [];

  constructor(
    private appState: AppStateService,
    private pageTitle: Title,
    private activatedRoute: ActivatedRoute,
    private errorsHandlingService: ErrorsHandlingService,
    private restService: RestService
  ) {
    this.product = new Product(0, '', '', 0, '', '');
  }

  ngOnInit(): void {
    this.handleProductInfo();

    this.setPageTitle();
  }

  ngAfterViewInit(): void {
    //stop page loading
    window.setTimeout(() => this.appState.controlLoading.next(false), 0);
  }

  handleProductInfo() {
    const params = this.activatedRoute.snapshot.params;

    //build product with selected id
    const product = ProductUtils.findProductById(+params['productId'], this.appState.getProductList());

    if (!product) {
      //load not found page
      this.errorsHandlingService.navigateToErrorPage('404');
      return;
    }

    this.product = product;

  }

  setPageTitle() {
    if (this.product) {
      const pagaTitleValue = this.product.getTitle();
      this.pageTitle.setTitle(pagaTitleValue);
    }
  }

  saveCartItem(quantity: number, increment: string) {
    const cartItem = {
      productId: this.product.getProductId(),
      quantity: quantity
    }

    //build request
    const requestObservable = this.restService.getCartRequestBuilder().postCartItem(cartItem, increment); //ad query param increment=yes
    const responseHandler = this.restService.getCartResponseHandler();

    //start loading
    this.appState.controlLoading.next(true);

    //send request
    const sub: Subscription =
      requestObservable.subscribe({

        next: (httpResponse: HttpResponse<CartItem>) => {
          responseHandler.postCartItem_OK(httpResponse);
        },

        error: (httpErrorResponse: HttpErrorResponse) => {
          responseHandler.postCartItem_ERROR(httpErrorResponse);
        }

      });

    //save subs
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
