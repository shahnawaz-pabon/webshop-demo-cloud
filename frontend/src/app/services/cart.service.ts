import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ShoppingCart } from '../model/interfaces/shopping-cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private localDataUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getCart(): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>(`${this.localDataUrl}/cart/list?userId=1`);
  }
}