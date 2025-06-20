import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UwCitiesToolComponent } from './uw-cities-tool.component';

describe('UwCitiesToolComponent', () => {
  let component: UwCitiesToolComponent;
  let fixture: ComponentFixture<UwCitiesToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UwCitiesToolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UwCitiesToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
