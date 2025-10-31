import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Product } from '../dashboard/add-product/add-product';

const PRODUCT_API_URL = '/api/Product';
const CATEGORY_API_URL = '/api/Category';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  /**
   * Retrieves the JWT token and sets it in the Authorization header.
   * Throws an error if token is missing.
   *
   * This method tries multiple common locations/names for the token on AuthService
   * and falls back to localStorage keys if needed. AuthService is cast to any to
   * avoid compile errors when a specific accessor doesn't exist.
   */
  private getAuthHeaders(): HttpHeaders {
    let token: string | null | undefined;

    // Try common method/property names on AuthService (avoid TS errors by casting to any)
    const authAny = this.auth as any;
    if (typeof authAny.getToken === 'function') {
      token = authAny.getToken();
    } else if (typeof authAny.getAccessToken === 'function') {
      token = authAny.getAccessToken();
    } else if (typeof authAny.getJwtToken === 'function') {
      token = authAny.getJwtToken();
    } else if (authAny.token) {
      token = authAny.token;
    } else if (authAny.accessToken) {
      token = authAny.accessToken;
    }

    // Fallback to common localStorage keys
    if (!token) {
      token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    }

    if (!token) {
      throw new Error('Authentication token not found.');
    }

    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Creates a new product.
   * @param data Product payload
   */
  createProduct(data: Partial<Product>): Observable<any> {
    // If data is FormData, don't set the Content-Type header so browser sets multipart boundary
    const headers = data instanceof FormData ? this.getAuthHeaders() : this.getAuthHeaders();
    return this.http.post(PRODUCT_API_URL, data as any, { headers });
  }

  /**
   * Fetches all products as a raw array.
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(PRODUCT_API_URL, { headers: this.getAuthHeaders() });
  }

  /**
   * Updates an existing product by ID.
   * @param id Product ID
   * @param data Updated product payload
   */
  updateProduct(id: number, data: Partial<Product>): Observable<any> {
    const headers = data instanceof FormData ? this.getAuthHeaders() : this.getAuthHeaders();
    return this.http.put(`${PRODUCT_API_URL}/${id}`, data as any, { headers });
  }

  /**
   * Deletes a product by ID with confirmation header.
   * @param id Product ID
   */
  deleteProduct(id: number): Observable<any> {
    const headers = this.getAuthHeaders().set('X-Confirm-Delete', 'true');
    return this.http.delete(`${PRODUCT_API_URL}/${id}`, { headers });
  }

  /**
   * Fetches all categories for dropdown binding.
   */
  getAllCategories(): Observable<any> {
    return this.http.get(CATEGORY_API_URL, { headers: this.getAuthHeaders() });
  }
}
