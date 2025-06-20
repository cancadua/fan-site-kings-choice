import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnchartedWatersComponent } from './uncharted-waters.component';

describe('UnchartedWatersComponent', () => {
  let component: UnchartedWatersComponent;
  let fixture: ComponentFixture<UnchartedWatersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnchartedWatersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnchartedWatersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
