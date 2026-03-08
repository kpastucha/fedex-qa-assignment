import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { CharacterProperties, SwapiResponse } from '../models/swapi.model';
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
      const mockResponse: SwapiResponse = {
        result: [{ properties: { name: 'Luke Skywalker' } as CharacterProperties }]
      };
      service.search('people', 'luke').subscribe((response) => {
        expect(response.result.length).toBe(1);
        expect(response.result[0].properties.name).toBe('Luke Skywalker');
      });
      const req = httpMock.expectOne('https://www.swapi.tech/api/people/?name=luke');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('Should pass through HTTP errors gracefully', () => {
      const status = StatusCodes.NOT_FOUND;
      let actualError: HttpErrorResponse | undefined;
      service.search('people', 'unknown').subscribe({
        next: () => fail('Should have failed with 404 error'),
        error: (error) => (actualError = error)
      });
      const req = httpMock.expectOne((request) => request.url.includes('/people/') && request.url.includes('name=unknown'));
      req.flush('Not Found', { status: status, statusText: getReasonPhrase(status) });
      expect(actualError?.status).toBe(status);
    });
  });
});
