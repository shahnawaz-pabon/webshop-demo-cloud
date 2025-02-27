import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CartItem, CartItemResponse } from '../../../model/interfaces/cart-item.interface';
import { Product } from '../../../model/product.model';
import { AppStateService } from '../../../services/app-state.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorsHandlingService } from '../../../services/errors-handling.service';
import { RestService } from '../../../services/rest.service';
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
    private restService: RestService,
    private router: Router
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

  saveCartItem(quantity: number) {
    const cartItem = {
      productId: this.product.getProductId(),
      quantity: quantity,
      userId: 1
    };

    const requestObservable = this.restService.getCartRequestBuilder().postCartItem(cartItem);
    const responseHandler = this.restService.getCartResponseHandler();

    this.appState.controlLoading.next(true);

    const sub: Subscription = requestObservable.subscribe({
      next: (response: HttpResponse<CartItemResponse>) => {
        responseHandler.postCartItem_OK(response);
      },
      error: (httpErrorResponse: HttpErrorResponse) => {
        responseHandler.postCartItem_ERROR(httpErrorResponse);
      }
    });

    this.subscriptions.push(sub);
  }

  // addToCart() {
  //   const cartItem = {
  //     userId: 1,
  //     productId: this.product.getProductId(),
  //     quantity: 1
  //   };

  //   const requestObservable = this.restService.getCartRequestBuilder().postCartItem(cartItem);
  //   const responseHandler = this.restService.getCartResponseHandler();

  //   requestObservable.subscribe({
  //     next: (response: HttpResponse<CartItemResponse>) => {
  //       responseHandler.postCartItem_OK(response);
  //     },
  //     error: (httpErrorResponse: HttpErrorResponse) => {
  //       responseHandler.postCartItem_ERROR(httpErrorResponse);
  //     }
  //   });
  // }

  updateProduct() {
    this.router.navigate(['/products', this.product.getProductId(), 'edit']);
  }

  deleteProduct() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.restService.getProductRequestBuilder()
        .deleteProductById(this.product.getProductId())
        .subscribe({
          next: (response) => {
            console.log('Product deleted successfully');
            this.router.navigate(['/products']);
          },
          error: (error) => {
            console.error('Error deleting product:', error);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
