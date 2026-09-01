import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StruggleForSupremacyComponent } from './struggle-for-supremacy.component';

describe('StruggleForSupremacyComponent', () => {
  let component: StruggleForSupremacyComponent;
  let fixture: ComponentFixture<StruggleForSupremacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StruggleForSupremacyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StruggleForSupremacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
