import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { env } from '../../../environments/env';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CartItem } from '../../model/interfaces/cart-item.interface';
import { Product } from '../../model/interfaces/product.interface';
import { ShoppingCart } from '../../model/interfaces/shopping-cart.interface';
import { AppStateService } from '../../services/app-state.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService } from '../../services/order.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule, CartItemComponent, MatSnackBarModule, MatIconModule],
})
export class CartComponent implements OnInit {
  cart: CartItem[] = [];
  totalPrice: number = 0;
  totalLength: number = 0;
  private stripePromise: Promise<Stripe | null>;
  private stripePublicKey = env.STRIPE_PUBLIC_KEY;
  private stripeSecretKey = env.STRIPE_SECRET_KEY;

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private appState: AppStateService,
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {
    this.stripePromise = loadStripe(this.stripePublicKey);
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe((data: ShoppingCart) => {
      this.cart = data.data.cart;
      this.totalPrice = data.data.totalPrice;
      this.totalLength = data.data.totalLength || 0;
      // Update the cart count in AppState
      const cartCount = this.cart.map(item => item.quantity).reduce((acc, curr) => acc + curr, 0);
      this.appState.updateCartCount(cartCount);
    });

    // Handle payment success/cancel scenarios
    this.route.queryParams.subscribe((params) => {
      if (params['payment'] === 'success') {
        this.handlePaymentSuccess();
      } else if (params['payment'] === 'cancel') {
        this.handlePaymentCancel();
      }
    });
  }

  async handleBuyProducts(): Promise<void> {
    const stripe = await this.stripePromise;

    if (!stripe) {
      console.error('Stripe.js failed to load');
      return;
    }

    // Validate and construct the line_items array
    const lineItems: Record<string, string>[] = this.cart.map((item, index) => {
      return {
        [`line_items[${index}][price_data][currency]`]: 'usd',
        [`line_items[${index}][price_data][product_data][name]`]: item.product.title,
        [`line_items[${index}][price_data][product_data][images][0]`]: item.product.imageUrl || '',
        [`line_items[${index}][price_data][unit_amount]`]: Math.round(item.product.price * 100).toString(),
        [`line_items[${index}][quantity]`]: item.quantity.toString(),
      };
    });

    // Flatten the array into a single object for URLSearchParams
    const sessionData = {
      cancel_url: `${window.location.origin}/cart?payment=cancel`,
      success_url: `${window.location.origin}/cart?payment=success`,
      mode: 'payment',
      "payment_method_types[]": "card",
      ...Object.assign({}, ...lineItems), // Merge line items into session data
    };

    try {
      const body = new URLSearchParams(sessionData).toString();

      console.log("this.stripeSecretKey>>>>>>>>>>>>>>>>>");
      console.log(this.stripeSecretKey);

      const session = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${this.stripeSecretKey}`,
        },
        body: body,
      }).then((res) => res.json());

      if (session.url) {
        // Redirect to the Stripe Checkout URL
        window.location.href = session.url;
      } else {
        console.error('Error creating session:', session);
      }
    } catch (error) {
      console.error('Error creating Stripe session:', error);
    }
  }

  handlePaymentSuccess(): void {
    // For now, we'll use userId 1 as that's what's used in the cart service
    const userId = 1;
    
    this.orderService.createOrder(userId).subscribe({
      next: (response) => {
        this.snackBar.open('🎉 Payment successful! Thank you for your purchase.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
          politeness: 'polite'
        });
        this.appState.updateCartCount(0);
        this.router.navigate(['/'], { queryParams: {} });
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.snackBar.open('❌ Payment was successful but there was an error creating your order. Please contact support.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
          politeness: 'polite'
        });
        this.router.navigate(['/cart'], { queryParams: {} });
      }
    });
  }

  handlePaymentCancel(): void {
    this.snackBar.open('❌ Payment was canceled. Please try again.', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
      politeness: 'polite'
    });
    this.router.navigate(['/cart'], { queryParams: {} });
  }

  handleItemDeleted(cartItemId: number) {
    this.cart = this.cart.filter(item => item.cartId !== cartItemId);
    // Update total price
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.totalPrice = this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }
}