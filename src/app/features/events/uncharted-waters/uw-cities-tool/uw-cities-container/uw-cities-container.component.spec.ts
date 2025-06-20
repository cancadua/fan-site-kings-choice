import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UwCitiesContainer } from './uw-cities-container.component';

describe('UwCitiesContainer', () => {
  let component: UwCitiesContainer;
  let fixture: ComponentFixture<UwCitiesContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UwCitiesContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(UwCitiesContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
