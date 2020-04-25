import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Product} from './product';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private categoriesUrl = '.netlify/functions/categories';
  private productsUrl = '.netlify/functions/products';

  constructor(private http: HttpClient) {
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productsUrl}/${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.categoriesUrl}/${category}`);
  }
}
