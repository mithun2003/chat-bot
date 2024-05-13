import { IAlertData } from 'src/app/shared/alert/model/alert.model';

export class AlertData {
  static getAlertInfo(): IAlertData[] {
    return [
      {
        alertType: 'inform',
        data: {
          title: 'Info',
          content: "You won't be able to revert this!",
          doneMsg: 'OK',
          cancelMsg: 'Cancel',
          close: false,
          timeout: 1000,
          isOk: true,
          isCancel: false,
          icon: 'circle-info',
          btnClass: 'bg-tertiary-red-color'
        }
      },
      {
        alertType: 'fail',
        data: {
          title: 'Oops!',
          content: 'Something went wrong!',
          doneMsg: 'OK',
          cancelMsg: 'Cancel',
          close: false,
          timeout: 1000,
          isOk: true,
          isCancel: false,
          refresh: false,
          icon: 'circle-xmark',
          btnClass: 'bg-tertiary-red-color'
        }
      },
      {
        alertType: 'success',
        data: {
          title: 'Success!',
          content: 'Completed Successfully',
          doneMsg: 'OK',
          cancelMsg: 'Cancel',
          close: false,
          timeout: 1000,
          isOk: true,
          isCancel: false,
          icon: 'circle-check',
          btnClass: 'bg-common-blue-color',
          iconClass: 'text-common-green-color'
        }
      },
      {
        alertType: 'confirm',
        data: {
          title: 'Confirm',
          content: "You won't be able to revert this!",
          doneMsg: 'OK',
          cancelMsg: 'Cancel',
          close: false,
          timeout: 1000,
          isOk: true,
          isCancel: true,
          icon: 'circle-question',
          btnClass: 'bg-tertiary-red-color'
        }
      },
      {
        alertType: 'warning',
        data: {
          title: 'Oops!',
          content: 'Please contact customer support.',
          doneMsg: 'OK',
          cancelMsg: 'Cancel',
          close: false,
          timeout: 1000,
          isOk: true,
          isCancel: false,
          icon: 'circle-exclamation',
          btnClass: 'bg-tertiary-red-color'
        }
      }
    ];
  }
}
