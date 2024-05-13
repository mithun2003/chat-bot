import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-common-button',
  standalone: true, // Indicates that this component is standalone
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FontAwesomeModule
  ],
  templateUrl: './common-button.component.html',
  styleUrls: ['./common-button.component.scss']
})
export class CommonButtonComponent {
  @Input() label = 'button'; // Input for the button label
  @Input() labelEnabled = true; // Input to control the visibility of the label
  @Input() buttonClass = ''; // Input for custom button class
  @Input() labelClass = ''; // Input for custom label class
  @Input() isLoading = false; // Input to control the loading state
  @Input() spinnerDiameter = 20; // Input for the spinner diameter
  @Input() tooltipMessage = ''; // Input for the tooltip message
  @Input() iconEnabled = false; // Input to control the visibility of the icon
  @Input() icon: IconProp = ['fas', 'plus']; // Input for the FontAwesome icon
  @Input() spinnerStyle = 'red'; // Input for the spinner color
  @Output() clickEmit = new EventEmitter<void>(); // Output event emitter for button click

  buttonClick() {
    this.clickEmit.emit();
  }

  // Get styles for the spinner
  getSpinnerStyle() {
    return {
      '--mdc-circular-progress-active-indicator-color': this.spinnerStyle
    };
  }
}
