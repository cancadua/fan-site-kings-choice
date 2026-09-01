import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarriorSceneComponent } from './warrior-scene.component';

describe('WarriorSceneComponent', () => {
  let component: WarriorSceneComponent;
  let fixture: ComponentFixture<WarriorSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarriorSceneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WarriorSceneComponent);
    fixture.componentRef.setInput('title', 'TEST');
    fixture.componentRef.setInput('backgroundSrc', 'assets/img/test-bg.png');
    fixture.componentRef.setInput('backgroundWidth', 1920);
    fixture.componentRef.setInput('backgroundHeight', 1080);
    fixture.componentRef.setInput('leftSrc', 'assets/img/test-left.png');
    fixture.componentRef.setInput('leftWidth', 429);
    fixture.componentRef.setInput('leftHeight', 1080);
    fixture.componentRef.setInput('rightSrc', 'assets/img/test-right.png');
    fixture.componentRef.setInput('rightWidth', 413);
    fixture.componentRef.setInput('rightHeight', 1080);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
