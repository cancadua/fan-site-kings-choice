import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { EVENT_CONTENT } from './index';

@Component({
  standalone: true,
  imports: [...EVENT_CONTENT],
  template: `
    <app-content-section heading="Overview">
      <app-content-text>Body copy.</app-content-text>
      <app-content-list [items]="['one', 'two']" />
      <app-content-note>Careful.</app-content-note>
    </app-content-section>
    <app-content-steps>
      <app-content-step heading="First">
        <app-content-text>Do the thing.</app-content-text>
      </app-content-step>
      <app-content-step heading="Custom" marker="★">
        <app-content-text>Then this.</app-content-text>
      </app-content-step>
    </app-content-steps>
  `,
})
class HostComponent {}

describe('event-content components', () => {
  it('render inside a host without errors', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.ec-section__title')?.textContent).toContain('Overview');
    expect(el.querySelectorAll('.ec-list li').length).toBe(2);
    expect(el.querySelector('.ec-note')?.textContent).toContain('Careful');
    expect(el.querySelectorAll('app-content-step').length).toBe(2);
  });
});
