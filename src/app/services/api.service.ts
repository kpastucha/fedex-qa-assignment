import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SwapiResponse } from '../models/swapi.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://www.swapi.tech/api/';

  search(type: string, query: string): Observable<SwapiResponse> {
    return this.http.get<SwapiResponse>(`${this.baseUrl}${type}/?name=${query}`);
  }
}
