import { GridApi } from '@ag-grid-community/core';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from 'src/app/shared/data-table/components/data-table.component';
import { IDtHeaderElements } from 'src/app/shared/data-table/model/data-table.model';
import { DtSearchBoxComponent } from 'src/app/shared/data-table/supporting-components/dt-search-box/dt-search-box.component';
import { DtSerialNumberComponent } from 'src/app/shared/data-table/supporting-components/dt-serial-number/dt-serial-number.component';
import { AdminService } from '../../service/admin.service';
// import { DataTableService } from 'src/app/shared/services/data-table/data-table.service';

export interface RowData {
  email: string;
}

@Component({
  selector: 'app-ent-list',
  templateUrl: './ent-list.component.html',
  styleUrls: ['./ent-list.component.scss'],
  standalone: true,
  imports: [DataTableComponent, HttpClientModule, FormsModule]
})
export class EntListComponent {
  tableUrl: string = 'ent';
  headerElements!: IDtHeaderElements;
  currentValue: number | undefined;
  adminService = inject(AdminService);

  // dataTableService = inject(DataTableService);
  selectedRows: RowData[] = [];
  selectedEmail: string[] = [];
  // alertService = inject(AlertService);
  showCreateModal = signal<boolean>(false);
  errorMessage: string = '';

  frameworkComponents = {
    searchBoxComponent: DtSearchBoxComponent
    // dateFilterComponent: DtDateRangeComponent
  };

  colDefId = {
    headerName: 'Sl.No',
    field: 'serialNumber',
    cellRenderer: DtSerialNumberComponent,
    maxWidth: 100,
    suppressMenu: true,
    checkboxSelection: true,
    lockPosition: true,
    resizable: false
  };

  colDefUserId = {
    headerName: 'User Id',
    field: 'user_id',
    minWidth: 250,
    floatingFilterComponent: 'searchBoxComponent',
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    suppressMenu: true,
    floatingFilterComponentParams: { suppressFilterButton: true }
  };

  colDefScore = {
    headerName: 'Score',
    field: 'score',
    minWidth: 250,
    // floatingFilterComponent: 'searchBoxComponent',
    // filter: 'agTextColumnFilter',
    floatingFilter: false,
    suppressMenu: true,
    floatingFilterComponentParams: { suppressFilterButton: true }
  };

  // colAction = {
  //   headerName: 'View',
  //   field: 'action',
  //   minWidth: 100,
  //   maxWidth: 150,
  //   suppressMenu: true,
  //   // cellRenderer: AdminViewCellRendererComponent,
  //   cellRendererParams: {
  //     field: 'action',
  //     type: 'view'
  //   },
  //   cellStyle: {
  //     width: 'full',
  //     display: 'flex',
  //     justifyContent: 'center'
  //   },
  //   headerClass: 'center-header'
  // };

  columnDefs = [
    this.colDefId,
    this.colDefUserId,
    this.colDefScore
    // this.colAction
  ];

  // for selecting the row
  onRowSelected(event: { api: GridApi }) {
    this.selectedRows = event.api.getSelectedRows();
    this.selectedEmail = this.selectedRows.map((el) => el?.email);
  }

  submitUserId() {
    if (typeof this.currentValue !== 'number'){
      this.errorMessage = 'Enter a valid User Id';
    }

    if (typeof this.currentValue === 'number') {
      if (this.currentValue < 0) {
        this.errorMessage = 'Number must be a non-negative number';
      } else {
        this.errorMessage = '';
        this.adminService.submitUserId(this.currentValue);
      }
    }
  }

  // refreshTable($event: boolean) {
  //   this.showCreateModal.set(false);
  //   if ($event === true) {
  //     this.dataTableService.refreshDataTable(
  //       this.display_platforms,
  //       this.dataTableService.dataTableParams
  //     );
  //   }
  // }
}
