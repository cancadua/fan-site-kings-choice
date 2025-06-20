import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTabsComponent } from './app-tabs.component';

describe('AppTabsComponent', () => {
  let component: AppTabsComponent;
  let fixture: ComponentFixture<AppTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch tabs', () => {
    component.tabs = [
      { label: 'Tab 1' },
      { label: 'Tab 2' },
      { label: 'Tab 3' },
    ];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBe(3);

    buttons[1].click();
    fixture.detectChanges();
    expect(component.activeTab).toBe('Tab 2');
    expect(compiled.querySelector('.tab-content')?.textContent).toContain(
      'You selected: Tab 2'
    );
  });
});
