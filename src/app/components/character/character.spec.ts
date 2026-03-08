import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CharacterProperties } from '../../models/swapi.model';
import { CharacterComponent } from './character.component';

describe('Character Component Unit Tests', () => {
  let component: CharacterComponent;
  let fixture: ComponentFixture<CharacterComponent>;
  const mockCharacter: CharacterProperties = {
    name: 'Luke Skywalker',
    gender: 'male',
    birth_year: '19BBY',
    eye_color: 'blue',
    skin_color: 'fair'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [CharacterComponent] }).compileComponents();
    fixture = TestBed.createComponent(CharacterComponent);
    component = fixture.componentInstance;
    component.character = mockCharacter;
    fixture.detectChanges();
  });

  describe('Identity & UI Structure', () => {
    it('Should render character name in a <h6> subtitle tag', () => {
      const header = fixture.debugElement.query(By.css('h6.card-subtitle')).nativeElement;
      expect(header.textContent).toContain(mockCharacter.name);
    });

    it('Should render exactly 4 rows for character details', () => {
      const rows = fixture.debugElement.queryAll(By.css('.card-body .row'));
      expect(rows.length).toBe(4);
    });
  });

  describe('Data Display', () => {
    const getValueByLabel = (label: string) => {
      const rows = fixture.debugElement.queryAll(By.css('.row'));
      const row = rows.find((r) => r.nativeElement.textContent.includes(label));
      return row?.query(By.css('.col-sm-10')).nativeElement.textContent.trim();
    };

    it('Should display correct physical and biographical attributes', () => {
      expect(getValueByLabel('Gender:')).toBe(mockCharacter.gender);
      expect(getValueByLabel('Birth year:')).toBe(mockCharacter.birth_year);
      expect(getValueByLabel('Eye color:')).toBe(mockCharacter.eye_color);
      expect(getValueByLabel('Skin color:')).toBe(mockCharacter.skin_color);
    });
  });

  describe('Edge Cases', () => {
    it('Should handle undefined character state gracefully', () => {
      component.character = undefined as unknown as CharacterProperties;
      fixture.detectChanges();
      const subtitle = fixture.debugElement.query(By.css('.card-subtitle')).nativeElement;
      expect(subtitle.textContent.trim()).toBe('');
    });
  });
});
