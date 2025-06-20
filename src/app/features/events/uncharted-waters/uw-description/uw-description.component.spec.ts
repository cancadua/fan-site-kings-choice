import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UwDescriptionComponent } from './uw-description.component';

describe('UwDescriptionComponent', () => {
  let component: UwDescriptionComponent;
  let fixture: ComponentFixture<UwDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UwDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UwDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
