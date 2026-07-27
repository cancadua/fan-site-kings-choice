import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThroneOfTheWolvesComponent } from './throne-of-the-wolves.component';

describe('ThroneOfTheWolvesComponent', () => {
  let component: ThroneOfTheWolvesComponent;
  let fixture: ComponentFixture<ThroneOfTheWolvesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThroneOfTheWolvesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThroneOfTheWolvesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
