import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideAdvancedComponent } from './guide-advanced.component';

describe('GuideAdvancedComponent', () => {
  let component: GuideAdvancedComponent;
  let fixture: ComponentFixture<GuideAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuideAdvancedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GuideAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
