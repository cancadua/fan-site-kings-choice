import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetRaceComponent } from './pet-race.component';

describe('PetRaceComponent', () => {
  let component: PetRaceComponent;
  let fixture: ComponentFixture<PetRaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetRaceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PetRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
