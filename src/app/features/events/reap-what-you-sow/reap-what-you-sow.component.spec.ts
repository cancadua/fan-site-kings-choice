import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ReapWhatYouSowComponent } from './reap-what-you-sow.component';

describe('ReapWhatYouSowComponent', () => {
  let component: ReapWhatYouSowComponent;
  let fixture: ComponentFixture<ReapWhatYouSowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReapWhatYouSowComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ReapWhatYouSowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
