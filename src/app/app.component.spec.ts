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
import { CharacterProperties, PlanetProperties, SwapiItem, SwapiResponse } from './models/swapi.model';
import { ApiService } from './services/api.service';

describe('App Component Integration Tests', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let queryParams$: BehaviorSubject<{ searchType: string; query: string }>;
  const mockCharacter: CharacterProperties = {
    name: 'Luke Skywalker',
    gender: 'male',
    birth_year: '19BBY',
    eye_color: 'blue',
    skin_color: 'fair'
  };
  const mockPlanet: PlanetProperties = {
    name: 'Tatooine',
    population: '200000',
    climate: 'arid',
    gravity: '1 standard'
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['search']);
    spy.search.and.returnValue(of({ result: [] }));
    queryParams$ = new BehaviorSubject({ searchType: 'people', query: 'luke' });
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
      mockApiSearch([{ properties: mockCharacter } as SwapiItem]);
      fixture.detectChanges();
      const firstResult = component.searchResult[0].properties as CharacterProperties;
      expect(firstResult.name).toBe('Luke Skywalker');
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
  });

  describe('Dynamic Rendering (Templates)', () => {
    it('Should render character component when people are searched', () => {
      mockApiSearch([{ properties: mockCharacter } as SwapiItem]);
      fixture.detectChanges();
      expect(getChildDebugElement(CharacterComponent)).toBeTruthy();
    });

    it('Should render multiple character components based on API results', () => {
      const results: SwapiItem[] = [
        { uid: '1', properties: { name: 'Luke' } as CharacterProperties } as SwapiItem,
        { uid: '2', properties: { name: 'Leia' } as CharacterProperties } as SwapiItem
      ];
      mockApiSearch(results);
      fixture.detectChanges();
      const characters = fixture.debugElement.queryAll(By.directive(CharacterComponent));
      expect(characters.length).toBe(2);
      expect(characters[0].componentInstance.character.name).toBe('Luke');
      expect(characters[1].componentInstance.character.name).toBe('Leia');
    });

    it('Should render planet component and hide character component when searchType is planets', () => {
      mockApiSearch([{ properties: mockPlanet } as SwapiItem]);
      queryParams$.next({ searchType: 'planets', query: 'tatooine' });
      fixture.detectChanges();
      const planetEl = getChildDebugElement(PlanetComponent);
      expect(planetEl).not.toBeNull();
      expect(planetEl?.componentInstance.planet.name).toBe('Tatooine');
      expect(getChildDebugElement(CharacterComponent)).toBeNull();
    });

    it('Should render multiple planet components based on API results', () => {
      queryParams$.next({ searchType: 'planets', query: 'a' });
      const results: SwapiItem[] = [
        { uid: '1', properties: { name: 'Tatooine' } as PlanetProperties } as SwapiItem,
        { uid: '2', properties: { name: 'Alderaan' } as PlanetProperties } as SwapiItem,
        { uid: '3', properties: { name: 'Hoth' } as PlanetProperties } as SwapiItem
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
      component.searchType = 'people';
      component.searchResult = [{ uid: '1', properties: mockCharacter } as SwapiItem, { uid: '2', properties: mockCharacter } as SwapiItem];
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
      queryParams$.next({ searchType: 'people', query: 'yoda' });
      fixture.detectChanges();
      expect(searchSpy).toHaveBeenCalledWith('people', 'yoda');
    });
  });

  function mockApiSearch(items: SwapiItem[]) {
    apiServiceSpy.search.and.returnValue(of({ result: items } as SwapiResponse));
  }

  function getChildDebugElement(directive: Type<unknown>) {
    return fixture.debugElement.query(By.directive(directive));
  }
});
