import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { finalize } from 'rxjs';
import { SwapiItem, SwapiResponse } from './models/swapi.model';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);
  searchType = '';
  searchResult: SwapiItem[] = [];
  isLoading = false;
  hasSearched = false;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const { searchType, query } = params;
      if (searchType && query) {
        this.isLoading = true;
        this.hasSearched = true;
        this.searchType = searchType;
        this.apiService
          .search(searchType, query)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: (response: SwapiResponse) => (this.searchResult = response.result),
            error: () => (this.searchResult = [])
          });
      }
    });
  }

  get showNotFound(): boolean {
    return this.hasSearched && !this.isLoading && this.searchResult.length === 0;
  }
}
