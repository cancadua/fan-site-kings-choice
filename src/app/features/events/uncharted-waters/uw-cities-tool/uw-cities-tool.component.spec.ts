import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UwCitiesToolComponent } from './uw-cities-tool.component';

describe('UwCitiesToolComponent', () => {
  let component: UwCitiesToolComponent;
  let fixture: ComponentFixture<UwCitiesToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UwCitiesToolComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UwCitiesToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
