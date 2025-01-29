import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { env } from '../../../environments/env';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule], // Import CommonModule for ngFor, ngIf, etc.
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  totalPrice: number = 0;
  private stripePromise: Promise<Stripe | null>;
  private stripePublicKey = env.STRIPE_PUBLIC_KEY;
  private stripeSecretKey = env.STRIPE_SECRET_KEY;

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.stripePromise = loadStripe(this.stripePublicKey);
  }

  ngOnInit(): void {
    // Fetch the cart data from the service
    this.cartService.getCart().subscribe((data) => {
      this.cart = data.cart;
      this.totalPrice = data.totalPrice;
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
        [`line_items[${index}][price_data][product_data][name]`]: item.product.name,
        [`line_items[${index}][price_data][product_data][images][0]`]: item.product.imageUrl || '',
        [`line_items[${index}][price_data][unit_amount]`]: Math.round(item.product.price * 100), // Convert to cents
        [`line_items[${index}][quantity]`]: item.quantity,
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
    alert('Payment successful! Thank you for your purchase.');
    // Clear the cart
    // this.cartService.clearCart();
    this.router.navigate(['/cart'], { queryParams: {} });
  }

  handlePaymentCancel(): void {
    alert('Payment was canceled. Please try again.');
    this.router.navigate(['/cart'], { queryParams: {} });
  }
}