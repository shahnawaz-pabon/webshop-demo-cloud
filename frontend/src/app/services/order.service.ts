import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderResponse, CreateOrderResponse, OrderHistoryResponse } from '../model/interfaces/order.interface';

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  createOrder(userId: number): Observable<HttpResponse<CreateOrderResponse>> {
    return this.http.post<CreateOrderResponse>(
      `${this.baseUrl}/order/create?userId=${userId}`,
      null,
      { observe: 'response' }
    );
  }

  getOrderHistory(userId: number): Observable<OrderHistoryResponse> {
    return this.http.get<OrderHistoryResponse>(`${this.baseUrl}/order/history?userId=${userId}`);
  }
} 