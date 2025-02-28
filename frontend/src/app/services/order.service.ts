import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderResponse } from '../model/interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getOrderHistory(userId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/order/history?userId=${userId}`);
  }
} 