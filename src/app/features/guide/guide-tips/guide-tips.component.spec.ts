import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideTipsComponent } from './guide-tips.component';

describe('GuideTipsComponent', () => {
  let component: GuideTipsComponent;
  let fixture: ComponentFixture<GuideTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuideTipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GuideTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
