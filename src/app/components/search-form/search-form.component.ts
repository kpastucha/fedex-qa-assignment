import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SEARCH_TYPE_DATA } from '../../models/search-type.model';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html'
})
export class SearchFormComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  @Input() isLoading = false;
  searchForm!: FormGroup;
  defaultSearchType = SEARCH_TYPE_DATA.PEOPLE;

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      searchType: [this.defaultSearchType],
      query: ['']
    });

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const { searchType, query } = params;
      this.searchForm.patchValue({ searchType: searchType || this.defaultSearchType, query: query || '' }, { emitEvent: false });
    });
  }

  search() {
    const { searchType, query } = this.searchForm.value;
    this.router.navigate([], {
      queryParams: {
        searchType,
        query: query || ''
      },
      queryParamsHandling: 'merge'
    });
  }
}
