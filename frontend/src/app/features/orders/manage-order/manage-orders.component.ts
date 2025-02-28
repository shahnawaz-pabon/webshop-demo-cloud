import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { AppStateService } from '../../../services/app-state.service';
import { Order, OrderResponse } from '../../../model/interfaces/order.interface';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private appState: AppStateService
  ) {}

  ngOnInit(): void {
    const userId = 1;
    if (userId) {
      this.orderService.getOrderHistory(userId).subscribe({
        next: (response) => {
          this.orders = response.data;
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
        }
      });
    }
  }
} 