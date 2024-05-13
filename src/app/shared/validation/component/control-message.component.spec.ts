import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  FaIconLibrary,
  FontAwesomeModule
} from '@fortawesome/angular-fontawesome';
import { ControlMessageComponent } from './control-message.component';

describe('ControlMessageComponent', () => {
  let component: ControlMessageComponent;
  let fixture: ComponentFixture<ControlMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ControlMessageComponent,
        CommonModule,
        FontAwesomeModule,
        ReactiveFormsModule
      ],
      providers: [FaIconLibrary]
    });
    fixture = TestBed.createComponent(ControlMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default control', () => {
    expect(component.control).toBeDefined();
    expect(component.control instanceof FormControl).toBeTruthy();
  });

  it('should have a default error message', () => {
    expect(component.errorMessage).toBeFalsy();
  });

  it('should set error message when control has errors and is touched', () => {
    const errorControl = new FormControl();
    errorControl.setErrors({ required: true });
    component.control = errorControl;
    component.control.markAsTouched();
    fixture.detectChanges();
    const { errorMessage } = component;

    expect(errorMessage).toBeTruthy();
  });

  it('should not set error message when control has errors but is not touched', () => {
    const errorControl = new FormControl();
    errorControl.setErrors({ required: true });
    component.control = errorControl;

    fixture.detectChanges();

    const { errorMessage } = component;

    expect(errorMessage).toBeFalsy();
  });
});
