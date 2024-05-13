import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ControlMessageComponent } from 'src/app/shared/validation/component/control-message.component';
import { CommonButtonComponent } from 'src/app/shared/components/common-button/common-button.component';
import { AlertService } from 'src/app/shared/alert/service/alert.service';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';
import { environment } from 'src/environments/environment';
import { CommonInputComponent } from 'src/app/shared/components/common-input/common-input.component';

/**
 * @description Method to change the root url.
 */
@Component({
  selector: 'app-change-base-url-modal-dev',
  templateUrl: './change-base-url-modal-dev.component.html',
  styleUrls: ['./change-base-url-modal-dev.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ControlMessageComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonButtonComponent,
    CommonInputComponent
  ]
})
export class ChangeBaseUrlModalDevComponent implements OnInit {
  url = new FormControl('', [Validators.required]);
  isChangedUrlExist = '';
  isChangedWebSocketUrlExist = '';
  baseUrl = '';
  webSocketUrl = '';

  private matDialogRef = inject(MatDialogRef<ChangeBaseUrlModalDevComponent>);
  private alertService = inject(AlertService);
  private localStorageService = inject(LocalStorageService);

  ngOnInit(): void {
    this.isChangedUrlExist =
      this.localStorageService.getItem('tempBaseRootUrl') ?? '';
    this.isChangedWebSocketUrlExist =
      this.localStorageService.getItem('tempWSUrl') ?? '';
    this.baseUrl = environment.baseUrl;
    this.webSocketUrl = environment.WebSocketUrl;
  }

  /**
   * @description Method to set the root url to localStorage and show alert.
   */
  onSubmit(): void {
    if (this.url.invalid) {
      return;
    }
    let originalUrl: string = this.url.value ?? '';
    let modifiedUrl: string;
    if (originalUrl.startsWith('http://')) {
      modifiedUrl = originalUrl.replace(/^http:\/\//, 'ws://');
    } else if (originalUrl.startsWith('https://')) {
      modifiedUrl = originalUrl.replace(/^https:\/\//, 'wss://');
    } else {
      modifiedUrl = `wss://${originalUrl}`;
      originalUrl = `https://${originalUrl}`;
    }
    this.localStorageService.setItem('tempWSUrl', modifiedUrl);
    this.localStorageService.setItem('tempBaseRootUrl', originalUrl);

    this.alertService.alertMessage('success', {
      content: `URL changed to ${originalUrl}`,
      close: true
    });
    this.matDialogRef.close();
  }

  onChangeValue() {
    const protocol = this.url.value?.slice(0, 4);
    if (protocol !== 'http' && (this.url.value?.length ?? 0) > 4) {
      const value = this.url.value?.replace(/\s/g, '') ?? '';
      this.url.setValue(`https://${value}`);
    } else {
      const value = this.url.value?.replace(/\s/g, '') ?? '';
      this.url.setValue(value);
    }
  }

  /**
   * @description Method to reset the base url to default and show alert.
   */
  resetBaseUrl(): void {
    this.localStorageService.removeItem('tempBaseRootUrl');
    this.localStorageService.removeItem('tempWSUrl');
    this.alertService.alertMessage('success', {
      content: `Reset to default.`,
      close: true
    });
    this.matDialogRef.close();
  }

  closeModal() {
    this.matDialogRef.close();
  }
}
