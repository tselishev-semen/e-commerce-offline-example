import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Hero} from "./hero";
import {catchError, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "./message.service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private heroesUrl = '.netlify/functions/category';

  constructor(private http: HttpClient) {
  }
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }
}
