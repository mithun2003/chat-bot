import { Injectable, inject } from '@angular/core';
import {
  IAlertContent,
  IAlertData,
  IAlertDefaultContent,
  TAlertType
} from 'src/app/shared/alert/model/alert.model';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertComponent } from '../component/alert.component';
import { AlertData } from '../component/alert-data';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private matDialog = inject(MatDialog);

  alertdataList: IAlertData[] = AlertData.getAlertInfo();
  alertData: IAlertDefaultContent = {
    title: 'Success!',
    content: 'Completed Successfully',
    doneMsg: 'OK',
    cancelMsg: 'cancel',
    close: false,
    timeout: 1000,
    isOk: false,
    isCancel: false,
    icon: 'circle-check',
    btnClass: 'bg-common-blue-color'
  };

  /**
   * @description Displays an alert message using the AlertComponent dialog.
   *
   * ### Alert modal with default alert message
   * @example this._alertService.alertMessage('confirm')
   * @summary above example show the confirm alert. Based on requirment change the value `confirm`.
   * Available alert types are `'inform' | 'fail' | 'success' | 'confirm' | 'warning'`
   *
   * ### Alert modal with custom alert message
   * @example
   * const alertData = {
   *    title: 'Oops',
   *    content: 'Transaction Failed',
   *    doneMsg: 'Pay Again'
   *    cancelMsg: 'Cancel'
   * }
   * this._alertService.alertMessage('confirm',alertData)
   *
   *
   * @param {IAlertType} alertType - The type of alert to display.
   * @param {IAlertContent} [alertData] - Optional data to pass to the alert component.
   * @returns {MatDialogRef<AlertComponent>} The reference to the opened dialog.
   */
  alertMessage(
    alertType: TAlertType,
    alertData?: IAlertContent
  ): MatDialogRef<AlertComponent> {
    this.setAlertMessage(alertType, alertData);
    const dialogRef = this.matDialog.open(AlertComponent, {
      maxWidth: '370px',
      minWidth: '370px',
      width: '95%',
      disableClose: true,
      data: { alertType, data: this.alertData }
    });
    return dialogRef;
  }

  /**
   * @description Set the alert message content based on the Injected data `alertData`.
   *
   * If `alertData` contain message content then show that content, otherwise show default content based on alert type.
   *
   */
  setAlertMessage(alertType: TAlertType, alertData?: IAlertContent): void {
    const filterData = this.alertdataList.filter(
      (item: { alertType: string | undefined }) => item.alertType === alertType
    );
    const correndAlert = filterData[0].data;
    const alertContent = alertData;
    this.alertData.title = alertContent?.title
      ? alertContent?.title
      : correndAlert.title;
    this.alertData.content = alertContent?.content
      ? alertContent?.content
      : (correndAlert.content as string);
    this.alertData.doneMsg = alertContent?.doneMsg
      ? alertContent?.doneMsg
      : correndAlert.doneMsg;
    this.alertData.cancelMsg = alertContent?.cancelMsg
      ? alertContent?.cancelMsg
      : (correndAlert.cancelMsg as string);
    this.alertData.close = alertContent?.close
      ? alertContent?.close
      : correndAlert.close;
    this.alertData.timeout = alertContent?.timeout
      ? alertContent?.timeout
      : correndAlert.timeout;
    this.alertData.isOk =
      alertContent?.isOk === false ? false : correndAlert.isOk;
    this.alertData.isCancel =
      alertContent?.isCancel === true ? true : correndAlert.isCancel;
    this.alertData.icon = correndAlert.icon as IconName;
    this.alertData.iconClass = alertContent?.iconClass
      ? alertContent?.iconClass
      : correndAlert.iconClass;
    this.alertData.btnClass = alertContent?.btnClass
      ? alertContent?.btnClass
      : correndAlert.btnClass;
  }
}
