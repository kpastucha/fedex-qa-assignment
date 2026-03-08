import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PlanetProperties } from '../../models/swapi.model';
import { PlanetComponent } from './planet.component';

describe('PlanetComponent Unit Tests', () => {
  let component: PlanetComponent;
  let fixture: ComponentFixture<PlanetComponent>;
  const mockPlanet: PlanetProperties = {
    name: 'Tatooine',
    population: '200000',
    climate: 'arid',
    gravity: '1 standard'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [PlanetComponent] }).compileComponents();
    fixture = TestBed.createComponent(PlanetComponent);
    component = fixture.componentInstance;
    component.planet = mockPlanet;
    fixture.detectChanges();
  });

  describe('Identity & UI Structure', () => {
    it('Should display the correct planet name in the card subtitle', () => {
      const nameElement = fixture.debugElement.query(By.css('.card-subtitle')).nativeElement;
      expect(nameElement.textContent).toContain(mockPlanet.name);
    });

    it('Should render exactly 3 rows for planet details', () => {
      const rows = fixture.debugElement.queryAll(By.css('.card-body .row'));
      expect(rows.length).toBe(3);
    });
  });

  describe('Environmental & Demographic Data', () => {
    const getValueByLabel = (label: string) => {
      const rows = fixture.debugElement.queryAll(By.css('.row'));
      const row = rows.find((r) => r.nativeElement.textContent.includes(label));
      return row?.query(By.css('.col-sm-10')).nativeElement.textContent.trim();
    };

    it('Should display correct population, climate and gravity details', () => {
      expect(getValueByLabel('Population:')).toBe(mockPlanet.population);
      expect(getValueByLabel('Climate:')).toBe(mockPlanet.climate);
      expect(getValueByLabel('Gravity:')).toBe(mockPlanet.gravity);
    });
  });

  describe('Edge Cases', () => {
    it('Should handle undefined planet state gracefully', () => {
      component.planet = undefined as unknown as PlanetProperties;
      fixture.detectChanges();
      const subtitle = fixture.debugElement.query(By.css('.card-subtitle')).nativeElement;
      expect(subtitle.textContent.trim()).toBe('');
    });
  });
});
