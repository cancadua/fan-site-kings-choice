import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDropComponent } from './app-drop.component';

describe('AppDropComponent', () => {
  let component: AppDropComponent;
  let fixture: ComponentFixture<AppDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppDropComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dropdown', () => {
    expect(component.isOpen).toBeFalse();
    component.toggleDropdown();
    expect(component.isOpen).toBeTrue();
    component.toggleDropdown();
    expect(component.isOpen).toBeFalse();
  });

  it('should display items', () => {
    // Fix: items should be an array of objects, not an object
    component.items.set([
      { name: 'Item 1', value: 'item1' },
      { name: 'Item 2', value: 'item2' },
      { name: 'Item 3', value: 'item3' },
    ]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('li').length).toBe(3);
  });
});
