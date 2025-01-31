import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppStateService } from '../../../services/app-state.service';
import { RestService } from '../../../services/rest.service';
import { CartItem } from '../../../model/interfaces/cart-item.interface';
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

  @ViewChild('quantityRef', {static: true}) quantityRef!: ElementRef;

  @ViewChild('cartItemRef', {static: true}) cartItemRef!: ElementRef;

  subscriptions: Subscription[] = [];

  constructor(
    private restService: RestService,
    private appState: AppStateService
    ) { }

  saveCartItem(increment: string) {
    console.log('Update cart item pressed');
  }

  deleteCartItem() {
    console.log('Delete cart item pressed');
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}