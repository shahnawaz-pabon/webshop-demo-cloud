import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private localDataUrl = 'assets/cart-data.json';

  constructor(private http: HttpClient) {}

  getCart(): Observable<any> {
    return this.http.get<any>(this.localDataUrl);
  }
}