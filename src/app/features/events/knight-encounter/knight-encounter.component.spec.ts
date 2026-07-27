import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnightEncounterComponent } from './knight-encounter.component';

describe('KnightEncounterComponent', () => {
  let component: KnightEncounterComponent;
  let fixture: ComponentFixture<KnightEncounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnightEncounterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KnightEncounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
