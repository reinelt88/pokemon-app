import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class PokemonService {

  private endpoint = 'https://pokeapi.co/api/v2';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getPokemons(limit: number =  20, offset: number = 0): Observable<any> {
    console.log(`${this.endpoint}/pokemon?limit=${limit}&offset=${offset}`);
    return this.http.get<any[]>(`${this.endpoint}/pokemon?limit=${limit}&offset=${offset}`)
      .pipe(
        catchError(this.handleError<any[]>('getPokemons', []))
      );
  }

  getPokemonByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/pokemon/${name}`).pipe(
      catchError(this.handleError<any>(`getPokemon name=${name}`))
    );
  }

  getTypes(): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/type`).pipe(
      catchError(this.handleError<any>(`getTypes`))
    );
  }

  getAbilities(): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/ability?limit=327`).pipe(
      catchError(this.handleError<any>(`getAbilities`))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
