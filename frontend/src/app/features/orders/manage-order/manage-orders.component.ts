import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders = [
    {
      id: '5548f609-0608-4652-b009-755f917ee6be',
      amount: 124.78,
      date: '2024/02/15 - 08:59:04',
      status: 'FULFILLED',
      email: 'mimmo@test.com',
      address: 'Street - Code - City',
      items: [
        { name: 'Uncharted 4 A Thief\'s End', price: 29.90, quantity: 2 },
        { name: 'The Last Of Us Part 2', price: 44.99, quantity: 1 },
        { name: 'Assassin\'s Creed The Ezio Collection', price: 19.99, quantity: 1 }
      ]
    }
    // Add more orders as needed
  ];

  ngOnInit(): void {
    // Load orders data
  }

  updateOrderStatus(orderId: string, status: string) {
    // Implement status update logic
    console.log(`Updating order ${orderId} to status: ${status}`);
  }
} 