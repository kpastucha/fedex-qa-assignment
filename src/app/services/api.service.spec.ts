import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { environment } from '../../environments/environment';
import { LUKE_MODEL_DATA } from '../models/character.model';
import { SEARCH_TYPE_DATA } from '../models/search-type.model';
import { SwapiResponseModel } from '../models/swapi.model';
import { ApiService } from './api.service';

describe('Api Service Unit Tests', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [ApiService] });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('Service Initialization', () => it('Should be created', () => expect(service).toBeTruthy()));

  describe('Search Requests', () => {
    it('Should fetch search result for people with correct URL and parameters', () => {
      const mockResponse: SwapiResponseModel = {
        result: [{ properties: LUKE_MODEL_DATA }]
      };
      service.search(SEARCH_TYPE_DATA.PEOPLE, 'luke').subscribe((response) => expect(response).toBe(mockResponse));
      const req = httpMock.expectOne(`${environment.swapiBaseUrl}/people/?name=luke`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('Should pass through HTTP errors gracefully', () => {
      const status = StatusCodes.NOT_FOUND;
      let actualError: HttpErrorResponse | undefined;
      service.search(SEARCH_TYPE_DATA.PEOPLE, 'unknown').subscribe({
        next: () => fail('Should have failed with 404 error'),
        error: (error) => (actualError = error)
      });
      const req = httpMock.expectOne((request) => request.url.includes('/people/') && request.url.includes('name=unknown'));
      req.flush('Not Found', { status: status, statusText: getReasonPhrase(status) });
      expect(actualError?.status).toBe(status);
    });
  });
});
