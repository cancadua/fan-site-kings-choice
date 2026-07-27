import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScarletBeautyComponent } from './scarlet-beauty.component';

describe('ScarletBeautyComponent', () => {
  let component: ScarletBeautyComponent;
  let fixture: ComponentFixture<ScarletBeautyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScarletBeautyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScarletBeautyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
