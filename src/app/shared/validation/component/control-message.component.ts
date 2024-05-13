import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ValidationService } from '../service/validation.service';

/**
 * @description Component for displaying validation error message.
 */
@Component({
  selector: 'app-control-message',
  templateUrl: './control-message.component.html',
  styleUrls: ['./control-message.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTooltipModule, FontAwesomeModule]
})
export class ControlMessageComponent {
  @Input() control: AbstractControl;
  @Input() isMarginTopEnabled = true;
  @Input() isMarginBottomEnabled = false;
  @Input() isErrorMessageCentered = false;
  @Input() marginTopOverride = 'mt-1';
  @Input() label = '';
  @Input() customMessages: { [key: string]: string } = {};

  constructor() {
    this.control = new FormControl();
  }

  /**
   * @description Retrieves the error message for the control.
   * @returns {string} The error message for the control, or false if no errors are found.
   */
  get errorMessage(): string {
    const errorEntries = Object.entries(this.control?.errors || {});
    let result = '';
    errorEntries.forEach(([propertyName, propertyValue]) => {
      if (this.control.touched) {
        if (this.customMessages[propertyName]) {
          result = this.customMessages[propertyName];
          return;
        }
        result =
          ValidationService.getValidationErrorMessage(
            propertyName,
            propertyValue,
            this.label
          ) ?? '';
      }
    });
    return result;
  }
}
