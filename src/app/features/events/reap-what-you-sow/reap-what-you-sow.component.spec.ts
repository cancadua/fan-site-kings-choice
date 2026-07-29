import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReapWhatYouSowComponent } from './reap-what-you-sow.component';

describe('ReapWhatYouSowComponent', () => {
  let component: ReapWhatYouSowComponent;
  let fixture: ComponentFixture<ReapWhatYouSowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReapWhatYouSowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReapWhatYouSowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
