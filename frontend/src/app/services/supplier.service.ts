import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SupplierRequest, SupplierResponse } from '../model/interfaces/supplier.interface';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  addSupplier(supplier: { name: string; email: string }): Observable<SupplierResponse> {
    const request: SupplierRequest = {
      name: supplier.name,
      contactInfo: supplier.email
    };
    return this.http.post<SupplierResponse>(`${this.baseUrl}/supplier/create`, request);
  }

  getSuppliers(page: number = 0, size: number = 10): Observable<SupplierResponse> {
    return this.http.get<SupplierResponse>(`${this.baseUrl}/supplier/list?page=${page}&size=${size}`);
  }
} 