import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Product} from "./product";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private categoryUrl = '.netlify/functions/category';
  private productUrl = '.netlify/functions/products';

  constructor(private http: HttpClient) {
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productUrl}/${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.categoryUrl}/${category}`);
  }
}
