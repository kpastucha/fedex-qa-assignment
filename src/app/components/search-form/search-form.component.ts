import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

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
  defaultSearchType = 'people';

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchType: [this.defaultSearchType],
      query: ['', [Validators.required]]
    });

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const { searchType, query } = params;
      this.searchForm.patchValue({
        searchType: searchType || this.defaultSearchType,
        query: query || ''
      });
    });
  }

  search(): void {
    if (this.searchForm.valid) {
      const { searchType, query } = this.searchForm.value;
      this.router.navigate([], {
        queryParams: {
          searchType,
          query
        },
        queryParamsHandling: 'merge'
      });
    }
  }
}
