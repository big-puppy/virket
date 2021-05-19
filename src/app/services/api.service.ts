//api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // API path
  contexto = 'https://run.mocky.io/v3/';

  uri = {
    userProfile: "82b8143c-f08a-4c55-b84f-05bc502d5c08",
    allProducts: "11f7165c-ea13-4ca6-8748-ca8bf94b5de5",
    shoppingCart: "b54da230-99a1-48a0-b826-9b2f50a2bbb7"
  }

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };


  userProfile(): Observable<any> {
    return this.http
      .get<any>(this.contexto + this.uri.userProfile)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  allProducts(): Observable<any> {
    return this.http
      .get<any>(this.contexto + this.uri.allProducts)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  shoppingCart(): Observable<any> {
    return this.http
      .get<any>(this.contexto + this.uri.allProducts)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

}