import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RestService {
    constructor(private http: HttpClient) { }

    getAuthRequestBuilder() {
        return {
            postLogout: (): Observable<HttpResponse<void>> => {
                return this.http.post<void>('/api/auth/logout', {}, { observe: 'response' });
            }
        };
    }

    getAuthResponseHandler() {
        return {
            postLogout_OK: (response: HttpResponse<void>) => {
                // Handle successful logout
            },
            postLogout_ERROR: (error: any) => {
                // Handle logout error
            }
        };
    }

    getFlashingRequestBuilder() {
        return {
            flashCart: (dataId: number): Observable<HttpResponse<void>> => {
                return this.http.post<void>(`/api/cart/flash/${dataId}`, {}, { observe: 'response' });
            }
        };
    }

    getFlashingResponseHandler() {
        return {
            flashCart_OK: (response: HttpResponse<void>) => {
                // Handle successful cart flash
            },
            flashCart_ERROR: (error: any) => {
                // Handle cart flash error
            }
        };
    }
} 