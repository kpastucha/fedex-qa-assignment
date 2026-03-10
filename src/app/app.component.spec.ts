import { Type } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { StatusCodes } from 'http-status-codes';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { CharacterComponent } from './components/character/character.component';
import { PlanetComponent } from './components/planet/planet.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { ANAKIN_MODEL_DATA, CharacterModel, LUKE_MODEL_DATA } from './models/character.model';
import { PlanetModel, TATOOINE_MODEL_DATA } from './models/planet.model';
import { SEARCH_TYPE_DATA, SearchType } from './models/search-type.model';
import { SwapiItemModel, SwapiResponseModel } from './models/swapi.model';
import { ApiService } from './services/api.service';

describe('App Component Integration Tests', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let queryParams$: BehaviorSubject<{ searchType: SearchType; query: string }>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['search']);
    spy.search.and.returnValue(of({ result: [] }));
    queryParams$ = new BehaviorSubject<{ searchType: SearchType; query: string }>({ searchType: SEARCH_TYPE_DATA.PEOPLE, query: 'luke' });
    await TestBed.configureTestingModule({
      declarations: [AppComponent, CharacterComponent, PlanetComponent, SearchFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ApiService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: queryParams$.asObservable() }
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  describe('Route and State Management', () => {
    it('Should correctly assign result to searchResult and update state flags', () => {
      mockApiSearch([{ properties: LUKE_MODEL_DATA } as SwapiItemModel]);
      fixture.detectChanges();
      const firstResult = component.searchResult[0].properties as CharacterModel;
      expect(firstResult.name).toBe(LUKE_MODEL_DATA.name);
      expect(component.isLoading).toBeFalse();
      expect(component.hasSearched).toBeTrue();
    });

    it('Should handle API error by clearing results and stopping the loader', () => {
      apiServiceSpy.search.and.returnValue(throwError(() => ({ status: StatusCodes.INTERNAL_SERVER_ERROR })));
      fixture.detectChanges();
      expect(component.searchResult).toEqual([]);
      expect(component.isLoading).toBeFalse();
      expect(component.showNotFound).toBeTrue();
    });

    it('Should clear results and not call API when query is empty', () => {
      component.searchResult = [{ properties: LUKE_MODEL_DATA } as SwapiItemModel];
      component.hasSearched = true;
      fixture.detectChanges();
      apiServiceSpy.search.calls.reset();
      queryParams$.next({ searchType: SEARCH_TYPE_DATA.PEOPLE, query: '' });
      fixture.detectChanges();
      expect(component.searchResult.length).toBe(0);
      expect(apiServiceSpy.search).not.toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
      expect(component.showNotFound).toBeFalse();
    });
  });

  describe('Dynamic Rendering (Templates)', () => {
    it('Should render character component when people are searched', () => {
      mockApiSearch([{ properties: LUKE_MODEL_DATA } as SwapiItemModel]);
      fixture.detectChanges();
      expect(getChildDebugElement(CharacterComponent)).toBeTruthy();
    });

    it('Should render multiple character components based on API results', () => {
      const results: SwapiItemModel[] = [
        { properties: { name: 'Luke' } as CharacterModel } as SwapiItemModel,
        { properties: { name: 'Leia' } as CharacterModel } as SwapiItemModel
      ];
      mockApiSearch(results);
      fixture.detectChanges();
      const characters = fixture.debugElement.queryAll(By.directive(CharacterComponent));
      expect(characters.length).toBe(2);
      expect(characters[0].componentInstance.character.name).toBe('Luke');
      expect(characters[1].componentInstance.character.name).toBe('Leia');
    });

    it('Should render planet component and hide character component when searchType is planets', () => {
      mockApiSearch([{ properties: TATOOINE_MODEL_DATA } as SwapiItemModel]);
      queryParams$.next({ searchType: SEARCH_TYPE_DATA.PLANETS, query: 'tatooine' });
      fixture.detectChanges();
      const planetEl = getChildDebugElement(PlanetComponent);
      expect(planetEl).not.toBeNull();
      expect(planetEl?.componentInstance.planet.name).toBe('Tatooine');
      expect(getChildDebugElement(CharacterComponent)).toBeNull();
    });

    it('Should render multiple planet components based on API results', () => {
      queryParams$.next({ searchType: SEARCH_TYPE_DATA.PLANETS, query: 'a' });
      const results: SwapiItemModel[] = [
        { properties: { name: 'Tatooine' } as PlanetModel } as SwapiItemModel,
        { properties: { name: 'Alderaan' } as PlanetModel } as SwapiItemModel,
        { properties: { name: 'Hoth' } as PlanetModel } as SwapiItemModel
      ];
      mockApiSearch(results);
      fixture.detectChanges();
      const planets = fixture.debugElement.queryAll(By.directive(PlanetComponent));
      expect(planets.length).toBe(3);
      expect(planets[0].componentInstance.planet.name).toBe('Tatooine');
      expect(planets[2].componentInstance.planet.name).toBe('Hoth');
    });
  });

  describe('Template Unit Tests', () => {
    it('Should display the main title', () => {
      fixture.detectChanges();
      const title = fixture.debugElement.query(By.css('h1')).nativeElement;
      expect(title.textContent).toBe('The Star Wars Search');
    });

    it('Should show "Loading..." only when isLoading is true', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      component.isLoading = true;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Loading...');
      component.isLoading = false;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toContain('Loading...');
    }));

    it('Should show "Not found." only when showNotFound is true', () => {
      component.isLoading = false;
      component.hasSearched = true;
      component.searchResult = [];
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Not found.');
    });

    it('Should render the search form component', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('app-search-form'))).not.toBeNull();
    });

    it('Should add correct number of <br /> tags based on state', () => {
      component.isLoading = false;
      component.searchResult = [];
      component.hasSearched = false;
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('br')).length).toBe(2);
      component.searchType = SEARCH_TYPE_DATA.PEOPLE;
      component.searchResult = [{ properties: LUKE_MODEL_DATA } as SwapiItemModel, { properties: ANAKIN_MODEL_DATA } as SwapiItemModel];
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('br')).length).toBe(4);
    });
  });

  describe('Child Communication', () => {
    it('Should pass isLoading state to SearchFormComponent', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      component.isLoading = true;
      fixture.detectChanges();
      const searchForm = getChildDebugElement(SearchFormComponent);
      expect(searchForm?.componentInstance.isLoading).toBeTrue();
    }));

    it('Should react to new query parameters by triggering a new search', () => {
      const searchSpy = apiServiceSpy.search;
      queryParams$.next({ searchType: SEARCH_TYPE_DATA.PEOPLE, query: 'yoda' });
      fixture.detectChanges();
      expect(searchSpy).toHaveBeenCalledWith(SEARCH_TYPE_DATA.PEOPLE, 'yoda');
    });
  });

  function mockApiSearch(items: SwapiItemModel[]) {
    apiServiceSpy.search.and.returnValue(of({ result: items } as SwapiResponseModel));
  }

  function getChildDebugElement(directive: Type<unknown>) {
    return fixture.debugElement.query(By.directive(directive));
  }
});
