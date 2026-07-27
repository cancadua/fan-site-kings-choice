import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarOfTheLionsComponent } from './war-of-the-lions.component';

describe('WarOfTheLionsComponent', () => {
  let component: WarOfTheLionsComponent;
  let fixture: ComponentFixture<WarOfTheLionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarOfTheLionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WarOfTheLionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
