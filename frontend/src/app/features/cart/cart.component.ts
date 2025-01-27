import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

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

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Fetch the cart data from the service
    this.cartService.getCart().subscribe((data) => {
      this.cart = data.cart;
      this.totalPrice = data.totalPrice;
    });
  }

  handleBuyProducts(): void {
    alert('Redirecting to Stripe Checkout...');
  }
}