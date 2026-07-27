import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragonIslandComponent } from './dragon-island.component';

describe('DragonIslandComponent', () => {
  let component: DragonIslandComponent;
  let fixture: ComponentFixture<DragonIslandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragonIslandComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DragonIslandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
