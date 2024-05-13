import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

interface IValidatorValue {
  requiredLength?: number;
  min?: number;
  requiredPattern?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  static matchingText: string;

  /**
   * @description Retrieves the validation error message based on the validator name and optional parameters.
   *
   * @param {string} validatorName - The name of the validator.
   * @param {IValidatorValue} [validatorValue] - Optional value for the validator.
   * @param {string} [labelName] - Optional label name for the field.
   * @returns {string} The validation error message.
   */
  public static getValidationErrorMessage(
    validatorName: string,
    validatorValue?: IValidatorValue,
    labelName?: string
  ): string {
    const data = {
      required: !labelName ? 'This field is required' : labelName,
      invalidPassword: `Password must be strong`,
      pattern: 'The field must contain characters, numbers and spaces only.',
      invalidMatch: this.matchingText,
      invalidPhoneLength: 'This field requires 10 digits',
      isPercentageInvalid: 'Choose a percentage between 25% and 100%',
      nonNegativeNumber: 'Number mush be a non-negative number'
    };
    /**
     * Custom handling for 'pattern' validator
     */
    if (validatorName === 'pattern') {
      if (validatorValue?.requiredPattern === '^[a-zA-Z0-9 ]+$') {
        data.pattern =
          'The field must contain characters, numbers and spaces only.';
      }
    }
    /**
     * Retrieve the error message based on the validator name
     */
    const vName = validatorName as keyof typeof data;
    return data[vName];
  }

  /**
   * ### Pattern Validation
   * @description Creates a pattern validator function that checks if the control value matches the given regular expression.
   *
   * @param {RegExp} regex - The regular expression to test the control value against.
   * @param {ValidationErrors} error - The error object to be returned if the control value does not match the pattern.
   * @returns {ValidatorFn} A validator function that checks if the control value matches the pattern.
   */
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: unknown } => {
      if (!control.value) {
        /**
         * If control is empty return no error
         */
        return {};
      }

      /**
       * Test the value of the control against the regexp supplied
       */
      const valid = regex.test(control.value);

      /**
       * If true, return no error (no error), else return error passed in the second parameter
       */
      return control.value && !valid ? error : {};
    };
  }

  /**
   *### White Space  Error
   * @description Validates the control to ensure it does not contain any whitespace.
   *
   * @param {AbstractControl} control - The form control to validate.
   * @returns {{hasWhitespace: boolean} | null} An object with the `hasWhitespace` property set to `true` if the control contains whitespace; otherwise, `null` if the control does not contain whitespace.
   */
  static noWhitespaceValidator(
    control: AbstractControl
  ): { hasWhitespace: boolean } | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { hasWhitespace: true };
  }

  /**
   * ### Get Validation Errors
   * Without using control message component
   * @description Retrieves the validation error message for a form control.
   *
   * @param {AbstractControl} control - The form control to retrieve the validation error message for.
   * @param {string} [labelName] - Optional label name for the field.
   * @returns {string | true} The validation error message as a string if there is an error; otherwise, returns true if there are no errors.
   */
  getValidationError(
    control: AbstractControl,
    labelName?: string
  ): string | true {
    // eslint-disable-next-line no-restricted-syntax
    for (const propertyName in control.errors) {
      if (
        Object.prototype.hasOwnProperty.call(control.errors, propertyName) &&
        control.touched
      ) {
        return ValidationService.getValidationErrorMessage(
          propertyName,
          control.errors[propertyName],
          labelName
        );
      }
    }
    return true;
  }

  /**
   * @description Creates a validator function that checks if the input control value matches the value of the confirm control.
   *
   * @param {string} confirmInput - The name of the confirm control.
   * @param {string} matchingTextFromComponent - The matching text to be used in the error message.
   * @returns {(control: FormControl) => {invalidMatch: boolean} | null} A validator function that checks if the input control value matches the value of the confirm control.
   */
  static isMatchingValidator(
    confirmInput: string,
    matchingTextFromComponent: string
  ): (control: FormControl) => { invalidMatch: boolean } | null {
    let checkingFieldOne: FormControl;
    let checkingFieldTwo: FormControl;
    this.matchingText = matchingTextFromComponent;

    return (control: FormControl) => {
      if (!control.parent) {
        return null;
      }

      if (!checkingFieldOne) {
        checkingFieldOne = control;
        checkingFieldTwo = control.parent.get(confirmInput) as FormControl;
        checkingFieldTwo.valueChanges.subscribe(() => {
          checkingFieldOne.updateValueAndValidity();
        });
      }

      if (
        checkingFieldTwo?.value?.toLocaleLowerCase() !==
        checkingFieldOne?.value?.toLocaleLowerCase()
      ) {
        return {
          invalidMatch: true
        };
      }

      return null;
    };
  }

  nonNegativeNumberValidator(control: AbstractControl) {
      const {value} = control;
      // Check if the value is a number and non-negative
      if (typeof value === 'number' && value >= 0) {
        return null; // Valid
      }
      return { nonNegativeNumber: true }; // Invalid
    }
}
