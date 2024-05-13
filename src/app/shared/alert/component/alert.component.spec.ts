import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IAlert } from 'src/app/shared/alert/model/alert.model';

import {
  MAT_DIALOG_DATA,
  MAT_DIALOG_SCROLL_STRATEGY,
  MatDialogRef
} from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import {
  FaIconLibrary,
  FontAwesomeModule
} from '@fortawesome/angular-fontawesome';
import { fad } from '@fortawesome/pro-duotone-svg-icons';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let mockMatDialogRef: Partial<MatDialogRef<AlertComponent>>;
  let mockMatDialogData: Partial<IAlert>;
  let iconLibrary: FaIconLibrary;
  beforeEach(waitForAsync(() => {
    mockMatDialogRef = {
      close: jasmine.createSpy('close')
    };
    mockMatDialogData = {
      alertType: 'success',
      alertContent: {
        title: 'Success!',
        content: 'Completed Successfully',
        doneMsg: 'OK',
        cancelMsg: 'Cancel',
        close: false,
        timeout: 1000,
        isOk: false,
        isCancel: false
      }
    };
    TestBed.configureTestingModule({
      declarations: [AlertComponent],
      providers: [
        FaIconLibrary,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
        {
          provide: MAT_DIALOG_SCROLL_STRATEGY,
          useFactory: (overlay: Overlay) => () =>
            overlay.scrollStrategies.block(),
          deps: [Overlay]
        },
        Overlay
      ],
      imports: [FontAwesomeModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AlertComponent);

        component = fixture.componentInstance;
        iconLibrary = TestBed.inject(FaIconLibrary);
        iconLibrary.addIconPacks(fad);
        fixture.detectChanges();
      });
  }));
  fit('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should set alert message on initialization', () => {
  //   component.ngOnInit();

  //   expect(component.title).toBe('Success!');

  //   expect(component.content).toBe('Completed Successfully');

  //   expect(component.doneMsg).toBe('OK');
  //   expect(component.cancelMsg).toBe('Cancel');
  //   expect(component.close).toBeFalse();

  //   expect(component.timeout).toBe(1000);

  //   expect(component.isOk).toBeFalse();

  //   expect(component.isCancel).toBeFalse();

  //   expect(component.icon).toBe('circle-check');
  // });

  it('should close dialog on done()', () => {
    component.done();

    expect(component.dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog on cancel()', () => {
    component.cancel();

    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });
});
