import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityButtonComponent } from './city-button.component';

describe('CityButtonComponent', () => {
  let component: CityButtonComponent;
  let fixture: ComponentFixture<CityButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CityButtonComponent);
    component = fixture.componentInstance;
    component.city = { name: 'Panama City' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the city name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.city-name')?.textContent).toContain(
      'Panama City'
    );
  });
});
