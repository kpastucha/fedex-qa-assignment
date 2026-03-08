import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchFormComponent } from './search-form.component';

describe('Search Form Component Tests', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchFormComponent],
      imports: [ReactiveFormsModule, RouterTestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('Integration Tests', () => {
    describe('User Input & Radio Controls', () => {
      it('Should be able to select planet radio via click', () => {
        getNativeElement('input[value="planets"]').click();
        fixture.detectChanges();
        expect(component.searchForm.get('searchType')?.value).toBe('planets');
      });

      it('Should be able to select character radio via click', () => {
        getNativeElement('input[value="people"]').click();
        fixture.detectChanges();
        expect(component.searchForm.get('searchType')?.value).toBe('people');
      });

      it('Should be able to select planet radio via change event (keyboard/accessibility)', () => {
        getNativeElement('input[value="planets"]').dispatchEvent(new Event('change'));
        fixture.detectChanges();
        expect(component.searchForm.get('searchType')?.value).toBe('planets');
      });

      it('Should be able to select character radio via change event (keyboard/accessibility)', () => {
        getNativeElement('input[value="people"]').dispatchEvent(new Event('change'));
        fixture.detectChanges();
        expect(component.searchForm.get('searchType')?.value).toBe('people');
      });
    });

    describe('Submission & Navigation', () => {
      it('Should call router.navigate with correct parameters on search()', () => {
        const spy = spyOn(router, 'navigate');
        component.searchForm.patchValue({ searchType: 'planets', query: 'Tatooine' });
        component.search();
        expect(spy).toHaveBeenCalledWith(
          [],
          jasmine.objectContaining({
            queryParams: { searchType: 'planets', query: 'Tatooine' }
          })
        );
      });

      it('Should trigger search when clicking on submit button', () => {
        const spy = spyOn(router, 'navigate');
        component.searchForm.patchValue({ searchType: 'people', query: 'Luke' });
        fixture.detectChanges();
        getNativeElement('button[type="submit"]').click();
        expect(spy).toHaveBeenCalled();
      });

      it('Should trigger search when hitting enter in the query input', () => {
        const spy = spyOn(router, 'navigate');
        component.searchForm.patchValue({ searchType: 'people', query: 'Luke' });
        fixture.detectChanges();
        fixture.debugElement.query(By.css('form')).triggerEventHandler('submit', null);
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('Template Unit Tests', () => {
    it('Should render two radio buttons with correct labels', () => {
      expect(getNativeElement('label[for="people"]').textContent).toContain('People');
      expect(getNativeElement('label[for="planets"]').textContent).toContain('Planets');
    });

    it('Should have a search input with id "query"', () => {
      const input = fixture.debugElement.query(By.css('input#query'));
      expect(input).not.toBeNull();
      expect(input.attributes['type']).toBe('search');
    });

    it('Should disable the submit button when the form is invalid', () => {
      component.searchForm.get('query')?.setValue('');
      fixture.detectChanges();
      expect(getSubmitButton().disabled).toBeTrue();
    });

    it('Should disable the submit button when isLoading is true', () => {
      component.searchForm.get('query')?.setValue('Luke');
      component.isLoading = true;
      fixture.detectChanges();
      expect(getSubmitButton().disabled).toBeTrue();
    });

    it('Should enable the submit button when form is valid and not loading', () => {
      component.searchForm.patchValue({ searchType: 'people', query: 'Luke' });
      component.isLoading = false;
      fixture.detectChanges();
      expect(getSubmitButton().disabled).toBeFalse();
    });

    it('Should have a visually hidden label for the query input', () => {
      const label = getNativeElement('label.visually-hidden');
      expect(label.getAttribute('for')).toBe('query');
      expect(label.textContent).toContain('Query');
    });
  });

  function getSubmitButton(): HTMLButtonElement {
    const debugEl = fixture.debugElement.query(By.css('button[type="submit"]'));
    return debugEl.nativeElement;
  }

  function getNativeElement(selector: string): HTMLElement {
    const debugEl = fixture.debugElement.query(By.css(selector));
    return debugEl.nativeElement;
  }
});
