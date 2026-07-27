import { Component, forwardRef, input, model, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-drop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-drop.component.html',
  styleUrls: ['./app-drop.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppDropComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDropComponent {
  truncateText(text: string | undefined, maxLength: number): string {
    if (!text) {
      return '';
    }

    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  items = model<Array<Record<string, string>>>();

  viewKey = input<string>('name');

  valueKey = input<string>('value');

  label = input<string>('Event');

  isOpen = false;

  selectedValue = model<string | null>(null);

  selectedObject: Record<string, string> | null = null;

  private onChange: (value: string | null) => void = () => {};

  private onTouched: () => void = () => {};

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
    this.onTouched();
  }

  selectItem(item: Record<string, string>) {
    const value = item[this.valueKey()];
    this.selectedValue.set(value);
    this.selectedObject = item;
    this.onChange(value);
    this.closeDropdown();
  }

  writeValue(value: string | null): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Optional: Handle disabled state if needed
  }
}
