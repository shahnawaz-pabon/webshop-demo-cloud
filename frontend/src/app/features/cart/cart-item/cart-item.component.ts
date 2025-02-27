import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppStateService } from '../../../services/app-state.service';
import { RestService } from '../../../services/rest.service';
import { CartItem, CartItemResponse } from '../../../model/interfaces/cart-item.interface';
import { FormatPricePipe } from '../../../pipes/format-price.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormatPricePipe,
    RouterLink
  ]
})
export class CartItemComponent implements OnDestroy {

  @Input()
  set cartItem(value: CartItem) {
    console.log('CartItem received:', value);
    this._cartItem = value;
  }
  get cartItem(): CartItem {
    return this._cartItem!;
  }
  private _cartItem!: CartItem;

  @ViewChild('quantityRef', { static: true }) quantityRef!: ElementRef;

  @ViewChild('cartItemRef', { static: true }) cartItemRef!: ElementRef;

  subscriptions: Subscription[] = [];

  constructor(
    private restService: RestService,
    private appState: AppStateService
  ) { }

  updateCartItem() {
    const newQuantity = parseInt(this.quantityRef.nativeElement.value);
    if (isNaN(newQuantity) || newQuantity < 1) {
      alert('Please enter a valid quantity');
      return;
    }

    const cartItem = {
      userId: 1,
      productId: this.cartItem.product.productId,
      quantity: newQuantity
    };

    this.restService.getCartRequestBuilder().postCartItem(cartItem).subscribe({
      next: (response: HttpResponse<CartItemResponse>) => {
        if (response.body?.data) {
          // Update the cart item with response data
          this.cartItem.quantity = response.body.data.quantity;
          this.cartItem.totalPrice = response.body.data.totalPrice;
          this.cartItem.product = response.body.data.product;

          // Update cart total in parent component
          this.appState.controlCartUpdate.next(true);

          console.log('Cart item updated successfully:', response.body.data);
        }
      },
      error: (error) => {
        console.error('Failed to update cart:', error);
        alert('Failed to update cart item');
      }
    });
  }

  deleteCartItem() {
    console.log('Delete cart item pressed');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}