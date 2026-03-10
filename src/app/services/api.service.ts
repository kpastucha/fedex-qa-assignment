import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SearchType } from '../models/search-type.model';
import { SwapiResponseModel } from '../models/swapi.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);

  search(type: SearchType, query: string): Observable<SwapiResponseModel> {
    return this.http.get<SwapiResponseModel>(`${environment.swapiBaseUrl}/${type}/?name=${query}`);
  }
}
