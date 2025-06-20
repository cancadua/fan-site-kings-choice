import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityButtonComponent } from './city-button.component';

describe('CityButtonComponent', () => {
  let component: CityButtonComponent;
  let fixture: ComponentFixture<CityButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
