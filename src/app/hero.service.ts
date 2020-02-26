import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Product} from './product';
import {MessageService} from './message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = '.netlify/functions/heroes';

  constructor(private http: HttpClient, private  messageService: MessageService) {
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      return of(result);
    };
  }

  // getHero(id: number): Observable<Category> {
  //   const url = `${this.heroesUrl}/${id}`;
  //
  //   return this.http.get<Category>(url)
  //     .pipe(
  //       tap(_ => this.log(`fetched hero id=${id}`)),
  //       catchError(this.handleError<Category>(`getHero id=${id}`))
  //     );
  // }
  //
  // getHeroes(): Observable<Category[]> {
  //   return this.http.get<Category[]>(this.heroesUrl)
  //     .pipe(
  //       tap(_ => this.log('fetched heroes')),
  //       catchError(this.handleError<Category[]>('getHeroes', []))
  //     );
  // }
}
