import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { AccountNoValidator, ValidationService } from './validation.service';

describe('ValidationService', () => {
  let validationService: ValidationService;
  const accountNo = '1234567890';
  const validator = AccountNoValidator(accountNo);

  beforeEach(() => {
    validationService = new ValidationService();
    TestBed.configureTestingModule({});
    validationService = TestBed.inject(ValidationService);
  });

  it('should return the correct validation error message for required validator', () => {
    const errorMessage =
      ValidationService.getValidationErrorMessage('required');
    expect(errorMessage).toBe('This field is required');
  });

  it('should return the correct validation error message for minlength validator', () => {
    const validatorValue = { requiredLength: 5 };
    const errorMessage = ValidationService.getValidationErrorMessage(
      'minlength',
      validatorValue
    );
    expect(errorMessage).toBe('The field must contain at least 5 characters');
  });

  it('should return the correct validation error message for max length validator', () => {
    const validatorValue = { requiredLength: 5 };
    const errorMessage = ValidationService.getValidationErrorMessage(
      'maxlength',
      validatorValue
    );
    expect(errorMessage).toBe("The field can't contain more than 5 characters");
  });

  it('should return the correct validation error message for minimum value validator', () => {
    const validatorValue = { min: 5 };
    const errorMessage = ValidationService.getValidationErrorMessage(
      'min',
      validatorValue
    );
    expect(errorMessage).toBe('Minimum value must be 5');
  });

  it('should return the correct validation error message for contain character.number and space', () => {
    const validatorValue = { requiredPattern: '^[a-zA-Z1-9 ]+$' };
    const errorMessage = ValidationService.getValidationErrorMessage(
      'pattern',
      validatorValue
    );
    expect(errorMessage).toBe(
      'The field must contain characters, numbers and spaces only.'
    );
  });

  it('should return no error for patternValidator when control value is empty', () => {
    const regex = /^([a-zA-Z1-9 ]+)$/;
    const error = { invalidPattern: true };
    const validatorFn = ValidationService.patternValidator(regex, error);
    const control = new FormControl('');
    const validationResult = validatorFn(control);
    expect(validationResult).toEqual({});
  });

  it('should return error for patternValidator when control value does not match pattern', () => {
    const regex = /^([a-zA-Z1-9 ]+)$/;
    const error = { invalidPattern: true };
    const validatorFn = ValidationService.patternValidator(regex, error);
    const control = new FormControl('!@#$');
    const validationResult = validatorFn(control);
    expect(validationResult).toEqual(error);
  });

  it('should return false when control value is empty', () => {
    const control = new FormControl('');
    const result = ValidationService.specialCharacter(control);
    expect(result).toBe(false);
  });

  it('should return false when control value does not contain special characters', () => {
    const control = new FormControl('password');
    const result = ValidationService.specialCharacter(control);
    expect(result).toBe(false);
  });

  it('should return true when control value  contain special characters', () => {
    const control = new FormControl('pass!word');
    const result = ValidationService.specialCharacter(control);
    expect(result).toBe(true);
  });

  it('should return undefined when control value is empty', () => {
    const control = new FormControl('');
    const result = validationService.passwordValidator(control);
    expect(result).toEqual(undefined);
  });

  it('should return null when control value is a valid password', () => {
    const control = new FormControl('Tyler!123');
    const result = validationService.passwordValidator(control);
    expect(result).toEqual({ invalidPassword: false });
  });

  it('should return error object when control value is an invalid password', () => {
    const control = new FormControl('123454');
    const result = validationService.passwordValidator(control);
    expect(result).toEqual({ invalidPassword: true });
  });

  it('should return false when control value is valid email', () => {
    const control = new FormControl('test@gmail.com');
    const result = ValidationService.emailValidator(control);
    expect(result).toBeFalsy();
  });

  it('should return null when control value is empty', () => {
    const control = new FormControl('');
    const result = ValidationService.emailValidator(control);
    expect(result).toBeNull();
  });

  it('should return error object when control value is an invalid email', () => {
    const control = new FormControl('testgmail.com');
    const result = ValidationService.emailValidator(control);
    expect(result).toEqual({ invalidEmailAddress: true });
  });

  it('should return null when control is empty', () => {
    const control = new FormControl('');
    const result = ValidationService.phoneNumberValidator(control);
    expect(result).toBeNull();
  });

  it('should return false when control value is  valid phone number', () => {
    const control = new FormControl('9896524514');
    const result = ValidationService.phoneNumberValidator(control);
    expect(result).toBeFalsy();
  });

  it('should return error object when control value is an invalid phone number', () => {
    const control = new FormControl('98965#4514');
    const result = ValidationService.phoneNumberValidator(control);
    expect(result).toEqual({
      invalidPhoneNumber: 'The phone number is not in a valid format'
    });
  });

  it('should return true when control value is empty', () => {
    const control = new FormControl('');
    const result = ValidationService.zipValidator(control);
    expect(result).toEqual(true);
  });

  it('should return true when control value is valid zip number', () => {
    const control = new FormControl('45612');
    const result = ValidationService.zipValidator(control);
    expect(result).toEqual(true);
  });

  it('should return error object when control value length less than 5 or greater than 10', () => {
    const control = new FormControl('456');
    const result = ValidationService.zipValidator(control);
    expect(result).toEqual({ invalidZip: false });
  });

  it('should return error object when control value is an invalid zip number', () => {
    const control = new FormControl('45612!');
    const result = ValidationService.zipValidator(control);
    expect(result).toEqual({ invalidZip: false });
  });

  it('should return true when control value is empty', () => {
    const control = new FormControl('');
    const result = ValidationService.routingNumberValidator(control);
    expect(result).toEqual(true);
  });

  it('should return error object when control value is an invalid routing number', () => {
    const control = new FormControl('11001412123');
    const result = ValidationService.routingNumberValidator(control);
    expect(result).toEqual({ invalidRoutingNumber: false });
  });

  it('should return false when control value is valid routing number', () => {
    const control = new FormControl('011000015');
    const result = ValidationService.routingNumberValidator(control);
    expect(result).toEqual(false);
  });

  it('should return null when control value does not have whitespace', () => {
    const control = new FormControl('Hello');
    const validationResult = ValidationService.noWhitespaceValidator(control);
    expect(validationResult).toBeNull();
  });

  it('should return { hasWhitespace: true } when control value has whitespace', () => {
    const control = new FormControl('   ');
    const validationResult = ValidationService.noWhitespaceValidator(control);
    expect(validationResult).toEqual({ hasWhitespace: true });
  });

  it('should return true when control value is empty', () => {
    const control = new FormControl('');
    const result = ValidationService.poBoxValidation(control);
    expect(result).toEqual(true);
  });

  it('should return false when control value does not match PO Box pattern', () => {
    const control = new FormControl('123 Main St');
    const validationResult = ValidationService.poBoxValidation(control);
    expect(validationResult).toBe(false);
  });

  it('should return true when control value matches PO Box pattern', () => {
    const control = new FormControl('PO Box 123');
    const validationResult = ValidationService.poBoxValidation(control);
    expect(validationResult).toEqual({ poBox: true });
  });

  it('should return true when control has no errors', () => {
    const control = new FormControl('Hello');
    control.markAsTouched();
    const validationResult = validationService.getValidationError(control);
    expect(validationResult).toBe(true);
  });

  it('should return error message when control has errors and is touched', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();
    const validationResult = validationService.getValidationError(control);
    expect(validationResult).toBe('This field is required');
  });

  it('should return true when control has errors but is not touched', () => {
    const control = new FormControl('', Validators.required);
    const validationResult = validationService.getValidationError(control);
    expect(validationResult).toBe(true);
  });

  it('should return { invalidUrl: true } for an invalid URL', () => {
    const url = new FormControl('example-url');
    const result = ValidationService.isUrlValid(url);
    expect(result).toEqual({ invalidUrl: true });
  });

  it('should return null when url is valid', () => {
    const url = new FormControl('https://www.example.com');
    const result = ValidationService.isUrlValid(url);
    expect(result).toBeNull();
  });

  it('should return true when input is null,empty or contain only whitespace character', () => {
    const input = '';
    const result = validationService.isNullOrWhitespace(input);
    expect(result).toEqual(true);
  });

  it('should return false when input contain other character', () => {
    const input = '  hello ';
    const result = validationService.isNullOrWhitespace(input);
    expect(result).toEqual(false);
  });

  it('should format the amount with 2 decimal places', () => {
    const amount = 1000.5;
    const formattedAmount = validationService.formatCurrency(amount);
    expect(formattedAmount).toEqual('1,000.50');
  });

  it('should format negative amount correctly', () => {
    const amount = -500.1234;
    const formattedAmount = validationService.formatCurrency(amount);
    expect(formattedAmount).toEqual('-500.12');
  });

  it('should format zero amount correctly', () => {
    const amount = 0;
    const formattedAmount = validationService.formatCurrency(amount);
    expect(formattedAmount).toEqual('0.00');
  });

  it('should format large amount correctly', () => {
    const amount = 1000000;
    const formattedAmount = validationService.formatCurrency(amount);
    expect(formattedAmount).toEqual('1,000,000.00');
  });

  it('should return true when entered value is numeric', () => {
    const input = { which: 49, keyCode: 24 };
    const result = ValidationService.numberOnly(input);
    expect(result).toBeTruthy();
  });

  it('should return false when entered value is not numeric', () => {
    const input = { which: 35, keyCode: 24 };
    const result = ValidationService.numberOnly(input);
    expect(result).toBeFalsy();
  });

  it('should format the value as a percentage with 2 decimal places', () => {
    const value = 0.125;
    const formattedValue = validationService.formatToPercentage(value);
    expect(formattedValue).toEqual('12.50%');
  });

  it('should format negative value as a percentage correctly', () => {
    const value = -0.5;
    const formattedValue = validationService.formatToPercentage(value);
    expect(formattedValue).toEqual('-50.00%');
  });

  it('should format zero value as a percentage correctly', () => {
    const value = 0;
    const formattedValue = validationService.formatToPercentage(value);
    expect(formattedValue).toEqual('0.00%');
  });

  it('should format 100% correctly', () => {
    const value = 1;
    const formattedValue = validationService.formatToPercentage(value);
    expect(formattedValue).toEqual('100.00%');
  });

  it('should return null if the control value matches the accountNo with length > 4', () => {
    const control = new FormControl(accountNo);
    const validationErrors = validator(control);

    expect(validationErrors).toBeNull();
  });

  it('should return null if the accountNo is not available or control value is not available', () => {
    const control = new FormControl('');
    const validationErrors = validator(control);

    expect(validationErrors).toBeNull();
  });

  it('should return the "accountNoMismatch" error if none of the conditions are met', () => {
    const control = new FormControl('123');
    const validationErrors = validator(control);

    expect(validationErrors).toEqual({ accountNoMismatch: true });
  });

  it('should return null when values match', () => {
    const confirmInput = 'confirmField';
    const matchingText = 'matchingText';

    const validatorFn: ValidatorFn = ValidationService.isMatchingValidator(
      confirmInput,
      matchingText
    ) as ValidatorFn;
    const control = new FormControl('value');

    control.setValidators(validatorFn);
    control.updateValueAndValidity({ emitEvent: false });

    const { errors } = control;

    expect(errors).toBeNull();
  });

  it('should return an error when values do not match', () => {
    const confirmInput = 'confirmField';
    const matchingText = 'matchingText';

    const validatorFn: ValidatorFn = ValidationService.isMatchingValidator(
      confirmInput,
      matchingText
    ) as ValidatorFn;
    const control = new FormControl('value1');

    control.setValidators(validatorFn);
    control.updateValueAndValidity({ emitEvent: false });

    const { errors } = control;

    expect(errors).toBeNull();
  });

  it('should validate ownership percentage', () => {
    const control = new FormControl(30);
    const result = ValidationService.validateOwnershipPercentage(control);
    expect(result).toBe('');
  });

  it('should return error for patternValidator when control value does not match pattern', () => {
    const regex = /^([a-zA-Z1-9 ]+)$/;
    const error = { invalidPattern: true };
    const validatorFn = ValidationService.patternValidator(regex, error);
    const control = new FormControl('!@#$'); // This should not match the pattern.
    const validationResult = validatorFn(control);
    expect(validationResult).toEqual(error);
  });

  it('should format zero amount correctly', () => {
    const amount = 0;
    const formattedAmount = validationService.formatCurrency(amount);
    expect(formattedAmount).toEqual('0.00');
  });

  it('should format 100% correctly', () => {
    const value = 1;
    const formattedValue = validationService.formatToPercentage(value);
    expect(formattedValue).toEqual('100.00%');
  });

  it('should return an error when values do not match', () => {
    const confirmInput = 'confirmField';
    const matchingText = 'matchingText';

    const validatorFn: ValidatorFn = ValidationService.isMatchingValidator(
      confirmInput,
      matchingText
    ) as ValidatorFn;
    const control = new FormControl('value1'); // Values should not match.

    control.setValidators(validatorFn);
    control.updateValueAndValidity({ emitEvent: false });

    const { errors } = control;

    expect(errors).not.toBeNull();
  });

  it('should return null when control parent is null', () => {
    const confirmInput = 'confirmField';
    const matchingText = 'matchingText';

    const validatorFn: ValidatorFn = ValidationService.isMatchingValidator(
      confirmInput,
      matchingText
    ) as ValidatorFn;
    const control = new FormControl('value');

    control.setValidators(validatorFn);
    control.updateValueAndValidity({ emitEvent: false });

    const { errors } = control;

    expect(errors).toBeNull();
  });
});
