import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject
} from '@angular/core';
import {
  ColDef,
  DomLayoutType,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IsRowSelectable,
  PaginationNumberFormatterParams,
  RowModelType,
  ModuleRegistry
} from '@ag-grid-community/core';
// import { AlertService } from 'src/app/shared/alert/service/alert.service';
import { ServerSideRowModelModule } from '@ag-grid-enterprise/server-side-row-model';
import { AgGridAngular } from '@ag-grid-community/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';
import {
  IColumnDefFields,
  IDtColumnFields,
  IDtHeaderElements,
  IFilter
} from '../model/data-table.model';
import { DataTableService } from '../service/data-table.service';
// import { DtLoadingComponent } from '../../supporting-components/dt-loading/dt-loading.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  standalone: true,
  imports: [NgClass, FontAwesomeModule, AgGridAngular]
})
export class DataTableComponent implements OnInit {
  dataTableService = inject(DataTableService);
  // alertService = inject(AlertService);
  constructor() {
    ModuleRegistry.registerModules([ServerSideRowModelModule]);
  }

  @Input() columnDefs: IColumnDefFields[] | undefined;
  @Input() public columnFields: IDtColumnFields[] | undefined;
  @Input() public width = '100%';
  @Input() public height = '100vh';
  @Input() public rowHeight = 50;
  @Input() tableUrl: string = '';
  @Input() heading: string = '';
  @Input() public frameworkComponents: { [key: string]: unknown } | undefined;
  @Input() public headerElements!: IDtHeaderElements;
  @Input() public domLayout: DomLayoutType = 'normal';
  @Input() public isRowSelectable: IsRowSelectable | undefined;
  @Input() public paginationPageSize = 10;
  @Input() public rowSelection: 'single' | 'multiple' = 'multiple';
  @Input() public postData:
    | { [key: string]: string | number | IFilter }
    | undefined;

  @Input() exportConfig: {
    heading: string;
    name: string;
    ignoreColumns?: string[];
  } = { heading: '', name: '' };

  @Input() public headerText = '';
  @Input() public toggleHeading: { toggle: boolean; isChange: boolean } = {
    toggle: false,
    isChange: false
  };

  @Output() paramsEmit = new EventEmitter();
  @Output() rowSelectedEmits = new EventEmitter();
  @Output() headerButtonEvent = new EventEmitter();
  @Output() headerFilterButtonClick = new EventEmitter();
  @Output() toggleTable = new EventEmitter();
  @Output() dataTableParams = new EventEmitter();

  gridApi: GridApi | undefined;
  selectedRows: string[] | undefined;
  public rowModelType: RowModelType = 'serverSide';
  noRowsTemplate: string | undefined;
  gridOptions: GridOptions | undefined;
  params: GridReadyEvent | undefined;
  headings: string[] | undefined;

  public defaultColDef: ColDef = {
    flex: 1,
    sortable: false,
    resizable: true,
    filter: true,
    minWidth: 100
  };

  public paginationNumberFormatter: (
    params: PaginationNumberFormatterParams
  ) => string = (params: PaginationNumberFormatterParams) =>
    `${params.value.toLocaleString()}`;

  ngOnInit() {
    this.dataTableService.resetDataTablePayload();
    this.noRowsTemplate = `
                          <div>
                          <img src="../../../../../assets/images/notFound.gif" alt="No data found">
                          <p class="text-md font-semibold ms-3 text-secondary-font-color text-md">No records found</p>
                          </div>`;
    this.setGridOptions();
    if (this.toggleHeading.toggle) {
      this.headings = this.heading.split('/');
    }
  }

  /**
   * The function sets the grid options for a table, including the context with the table URL.
   */
  setGridOptions() {
    this.gridOptions = {
      context: {
        tableUrl: this.tableUrl
      },
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 50, 100],
      // loadingCellRenderer: DtLoadingComponent,
      loadingCellRendererParams: {}
    };
  }

  /**
   * This function is automatically called by AG Grid when
   * the data is supplied from backend to the Grid.
   * @param params These are the params we are getting from AG Grid.
   */
  onGridReady(params: GridReadyEvent) {
    this.setDataTableValuesToService();
    this.gridApi = params.api;
    this.params = params;
    this.dataTableParams.emit(params);
    this.dataTableService.getDataTableLists(this.tableUrl, {}, params);
  }

  setDataTableValuesToService() {
    this.dataTableService.exportConfig = this.exportConfig;
    this.dataTableService.paginationPageSize = this.paginationPageSize;
    this.dataTableService.postData = this.postData;
    this.dataTableService.tableUrl.set(this.tableUrl);
  }

  /**
   * @description - to get all selected rows in the ag-grid data table.
   * @emits - rowSelectedEmits :- It emits all the selected rows.
   */
  onRowSelectionChanged(event: { api: GridApi }): void {
    this.selectedRows = this.gridApi?.getSelectedRows();
    this.rowSelectedEmits.emit(event);
  }

  /**
   * @description  Handles a click event on a panel button.
   * Emits an event with button ID, selected rows, and table ID.
   * @param {string | number} id - The ID of the clicked panel button.
   */
  onPanelButtonClick(id: string | number) {
    this.headerButtonEvent.emit(id);
  }

  toggleTableHeading() {
    this.toggleTable.emit();
  }
}
