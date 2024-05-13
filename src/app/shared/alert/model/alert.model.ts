import { SafeHtml } from '@angular/platform-browser';
import { IconName } from '@fortawesome/fontawesome-svg-core';

export type TAlertType = 'inform' | 'fail' | 'success' | 'confirm' | 'warning';

export interface IAlert {
  alertType: TAlertType;
  alertContent: IAlertContent;
}

export interface IAlertContent {
  /**
   * Title of the alert
   */
  title?: string | null;
  /**
   * Subtitle of the alert
   */
  content?: string;
  /**
   * Confirm message of the alert
   */
  doneMsg?: string;
  /**
   * Cancel message of the alert
   */
  cancelMsg?: string;
  /**
   * Automatic close the alert modal
   */
  close?: boolean;
  /**
   * Closes the alert after the given value
   */
  timeout?: number;
  /**
   * Show Confirm button of the alert
   */
  isOk?: boolean;
  /**
   * Show Cancel button of the alert
   */
  isCancel?: boolean;

  icon?: string;

  btnClass?: string;
  iconClass?: string;
}

export interface IAlertDefaultContent {
  title: string;
  content: string | SafeHtml;
  doneMsg: string;
  cancelMsg: string;
  close: boolean;
  timeout: number;
  isOk: boolean;
  icon: IconName;
  isCancel: boolean;
  refresh?: boolean;
  btnClass?: string;
  iconClass?: string;
}

export interface IAlertData {
  alertType: string;
  data: IAlertDefaultContent;
}
