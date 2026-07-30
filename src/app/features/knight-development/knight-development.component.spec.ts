import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KnightDevelopmentComponent } from './knight-development.component';

describe('KnightDevelopmentComponent', () => {
  let component: KnightDevelopmentComponent;
  let fixture: ComponentFixture<KnightDevelopmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnightDevelopmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KnightDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial active section as overview', () => {
    expect(component.activeSection).toBe('overview');
  });

  it('should change active section when activeSection is set', () => {
    component.activeSection = 'golden-rule';
    expect(component.activeSection).toBe('golden-rule');
  });

  it('should return correct active section', () => {
    component.activeSection = 'power-breakdown';
    const activeSection = component.getActiveSection();
    expect(activeSection?.id).toBe('power-breakdown');
  });

  it('should have multiple sections', () => {
    expect(component.sections.length).toBeGreaterThan(5);
  });

  it('should have subsections in some sections', () => {
    const sectionWithSubsections = component.sections.find(
      s => s.subsections && s.subsections.length > 0
    );
    expect(sectionWithSubsections).toBeTruthy();
  });
});
