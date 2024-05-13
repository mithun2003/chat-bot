import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererParams } from '@ag-grid-community/core';

@Component({
  selector: 'app-dt-text-color',
  template: ` <span [class]="status.color">{{ status.value }}</span> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class DtTextColorComponent {
  params!: ICellRendererParams & { type: string };
  status = {
    color: '',
    value: ''
  };

  agInit(params: ICellRendererParams & { type: string }): void {
    this.params = params;
    if (this.params.type === 'api-usage-method') {
      this.apiUsageMethod();
    }
    if (this.params.type === 'api-usage-status-code') {
      this.apiUsageStatusCode();
    }
  }

  apiUsageMethod(): void {
    const method = this.params?.data?.method;
    this.status = { ...this.status, value: method };
    if (method === 'POST') {
      this.status = { ...this.status, color: 'text-tertiary-green-color' };
    }
    if (method === 'GET') {
      this.status = { ...this.status, color: 'text-common-blue-color' };
    } else {
      this.status = { ...this.status, color: 'text-common-yellow-color' };
    }
  }

  apiUsageStatusCode(): void {
    const statusCode = this.params?.data?.status_code;
    this.status = { ...this.status, value: statusCode };
    if (statusCode === 200) {
      this.status = { ...this.status, color: 'text-tertiary-green-color' };
    } else if (statusCode === 404) {
      this.status = { ...this.status, color: 'text-tertiary-red-color' };
    } else {
      this.status = { ...this.status, color: 'text-common-yellow-color' };
    }
  }
}
