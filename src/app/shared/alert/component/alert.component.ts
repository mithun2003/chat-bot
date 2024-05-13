import { Component, OnInit, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

import { IAlertData, IAlertDefaultContent } from '../model/alert.model';
import { CommonButtonComponent } from '../../components/common-button/common-button.component';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    CommonButtonComponent,
    MatDialogModule
  ]
})
export class AlertComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<AlertComponent>);

  alertData: IAlertData = inject(MAT_DIALOG_DATA);
  alertContent: IAlertDefaultContent = this.alertData.data;

  ngOnInit(): void {
    if (this.alertContent.close) {
      setTimeout(() => {
        this.dialogRef.close(true);
      }, this.alertContent.timeout);
    }
  }

  /**
   * @description Closes the dialog with a true value indicating "Done" button is clicked.
   */
  done(): void {
    this.dialogRef.close(true);
  }

  /**
   * Closes the dialog with a false value indicating "Cancel" button is clicked.
   */
  cancel(): void {
    this.dialogRef.close(false);
  }
}
