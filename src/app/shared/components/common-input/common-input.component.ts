/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { CommonButtonComponent } from '../common-button/common-button.component';
import { ControlMessageComponent } from '../../validation/component/control-message.component';

@Component({
  standalone: true,
  selector: 'app-common-input',
  templateUrl: './common-input.component.html',
  styleUrls: ['./common-input.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ControlMessageComponent,
    CommonButtonComponent
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommonInputComponent),
      multi: true
    }
  ]
})
export class CommonInputComponent implements ControlValueAccessor {
  inputType = input<'text' | 'password' | 'search' | 'number'>('text');
  placeholder = input<string>('Enter...');
  filledBackground = input<boolean>(false);
  control = input<FormControl>(new FormControl(''));

  changeDetectorRef = inject(ChangeDetectorRef);

  inputValue: number | string = '';
  passwordVisible = false;
  inputDisabled = false;
  hasErrorInControl = false;

  clearInput() {
    if (this.inputDisabled) return;
    this.inputValue = '';
    this.onChange(this.inputValue);
  }

  validateInput() {
    if (this.inputType() === 'number') {
      this.inputValue = Number(
        this.inputValue.toString().replace(/[^0-9]/g, '') ?? ''
      );
    }
  }

  /**
   * VALUE ACCESSOR
   */
  //
  onChange: (value: string | number) => void = () => {};

  onTouch: (value: string | number) => void = () => {};

  writeValue(value: string): void {
    this.inputValue = value;
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (value: string | number) => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.inputDisabled = isDisabled;
  }
}
