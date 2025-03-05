import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { AppStateService } from '../../../services/app-state.service';
import { Order, OrderResponse } from '../../../model/interfaces/order.interface';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private appState: AppStateService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const userId = 1;
    if (userId) {
      this.orderService.getOrderHistory(userId).subscribe({
        next: (response) => {
          this.orders = response.data;
          // Initialize shipment status with order status if it's valid, otherwise set to pending
          this.orders.forEach(order => {
            const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
            order.shipmentStatus = validStatuses.includes(order.status?.toLowerCase()) ? order.status.toLowerCase() : 'pending';
          });
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
        }
      });
    }
  }

  onShipmentStatusChange(order: Order): void {
    // Here you would typically make an API call to update the shipment status
    console.log(`Order ${order.orderId} shipment status changed to: ${order.shipmentStatus}`);
    
    // Update the order status in the backend
    this.orderService.updateOrderStatus(order.orderId, order.shipmentStatus).subscribe({
      next: () => {
        console.log('Order status updated successfully');
        this.snackBar.open(`✅ Order #${order.orderId} status updated to ${order.shipmentStatus}`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      },
      error: (error: Error) => {
        console.error('Error updating order status:', error);
        this.snackBar.open(`❌ Failed to update order #${order.orderId} status`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
} 