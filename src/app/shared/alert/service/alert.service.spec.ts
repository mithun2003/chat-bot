import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../component/alert.component';
import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;
  let mockMatDialog: Partial<MatDialog>;

  beforeEach(() => {
    mockMatDialog = {
      open: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AlertService,
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });

    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open the alert dialog with the provided data', () => {
    const mockAlertData = {
      title: 'Test Title',
      content: 'Test Content',
      cancelMsg: 'Cancel',
      close: false,
      doneMsg: 'OK',
      icon: 'circle-check',
      isCancel: false,
      isOk: true,
      timeout: 1000
    };

    service.alertMessage('success', mockAlertData);

    const alertType = 'success';
    expect(mockMatDialog.open).toHaveBeenCalledWith(AlertComponent, {
      maxWidth: '370px',
      minWidth: '370px',
      width: '95%',
      disableClose: true,
      data: { alertType, data: mockAlertData }
    });
  });

  it('should open the alert dialog with default content if no alertData is provided', () => {
    service.alertMessage('success');

    const alertType = 'success';
    const defaultAlertData = {
      title: 'Success!',
      content: 'Completed Successfully',
      doneMsg: 'OK',
      cancelMsg: 'Cancel',
      close: false,
      timeout: 1000,
      isOk: true,
      isCancel: false,
      icon: 'circle-check'
    };

    expect(mockMatDialog.open).toHaveBeenCalledWith(AlertComponent, {
      maxWidth: '370px',
      minWidth: '370px',
      width: '95%',
      disableClose: true,
      data: { alertType, data: defaultAlertData }
    });
  });

  it('should set the alert message based on the injected data', () => {
    const mockAlertData = {
      title: 'Success!',
      content: 'Completed Successfully',
      doneMsg: 'OK',
      cancelMsg: 'Cancel',
      close: false,
      timeout: 1000,
      isOk: true,
      isCancel: false,
      icon: 'circle-check'
    };

    service.setAlertMessage('success', mockAlertData);

    const expectedAlertData = {
      title: 'Success!',
      content: 'Completed Successfully',
      doneMsg: 'OK',
      cancelMsg: 'Cancel',
      close: false,
      timeout: 1000,
      isOk: true,
      isCancel: false,
      icon: 'circle-check'
    };

    expect(service.alertData).toEqual(expectedAlertData);
  });

  it('should not equal the alert data when calling the setAlertMessage method', () => {
    const mockAlertData = {
      title: 'Success!',
      content: 'Completed Successfully',
      doneMsg: 'OK',
      cancelMsg: 'Cancel',
      close: false,
      timeout: 1000,
      isOk: true,
      isCancel: false,
      icon: 'circle-check'
    };

    service.setAlertMessage('success', mockAlertData);

    const expectedAlertData = {
      title: 'Oops!',
      content: 'Please contact customer support.',
      doneMsg: 'OK',
      cancelMsg: 'Cancel',
      close: true,
      timeout: 5000,
      isOk: true,
      isCancel: true,
      icon: 'circle-xmark'
    };

    expect(service.alertData).not.toEqual(expectedAlertData);
  });
});
