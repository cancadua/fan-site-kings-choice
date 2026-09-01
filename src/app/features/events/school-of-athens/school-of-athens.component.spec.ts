import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolOfAthensComponent } from './school-of-athens.component';

describe('SchoolOfAthensComponent', () => {
  let component: SchoolOfAthensComponent;
  let fixture: ComponentFixture<SchoolOfAthensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolOfAthensComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolOfAthensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
