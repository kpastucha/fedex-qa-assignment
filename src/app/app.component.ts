import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { SEARCH_TYPE_DATA, SearchType } from './models/search-type.model';
import { SwapiItemModel, SwapiResponseModel } from './models/swapi.model';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);
  readonly SEARCH_TYPES = SEARCH_TYPE_DATA;
  searchType: SearchType = SEARCH_TYPE_DATA.PEOPLE;
  searchResult: SwapiItemModel[] = [];
  isLoading = false;
  hasSearched = false;

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const searchType = params['searchType'] as SearchType;
      const query = params['query'];
      if (searchType != null && query != null) {
        this.searchType = searchType;
        this.searchResult = [];
        if (query.trim() === '') {
          this.isLoading = false;
          this.hasSearched = false;
          return;
        }
        this.isLoading = true;
        this.hasSearched = true;
        this.apiService
          .search(searchType, query)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: (response: SwapiResponseModel) => (this.searchResult = response.result),
            error: () => (this.searchResult = [])
          });
      }
    });
  }

  get showNotFound() {
    return this.hasSearched && !this.isLoading && this.searchResult.length === 0;
  }
}
