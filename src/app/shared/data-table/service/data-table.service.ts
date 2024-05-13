import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import {
  GridApi,
  GridReadyEvent,
  IServerSideGetRowsParams
} from '@ag-grid-community/core';
import { Subject } from 'rxjs';
import {
  IDefaultPayload,
  IFilter,
  IDataTableResponse,
  IFilterModel,
  IcellRendererParams
} from '../model/data-table.model';
import { DataTableRepository } from '../repository/data-table.repository';


interface ResponseType {
  status_code: number;
  message: string;
  email: string;
}

/**
 * @description - Service for fetching data for a specific table from the data source and some other datas related to data table.
 */
@Injectable({
  providedIn: 'root'
})
export class DataTableService implements OnDestroy {
  private dataTableRepository = inject(DataTableRepository);

  tableUrl = signal('');
  defaultPayload: IDefaultPayload | undefined;
  dataTableParams?: GridReadyEvent;
  gridApi: GridApi | undefined;
  paginationPageSize = 10;
  exportConfig: {
    heading: string;
    name: string;
    ignoreColumns?: string[];
  } = { heading: '', name: '' };

  postData: { [key: string]: string | number | IFilter } | undefined;
  rowCounts: number | undefined | null;
  rowData: unknown[] = [];
  filterModel: object = {};
  tableData: unknown;
  loading = false;
  showNoResult = false;
  refreshingBtn = signal(false);
  disableRefreshingBtn = signal(true);
  selectAllCheckbox = signal(false);
  // requestResponseBody = signal<APILogObject | undefined>(undefined);
  apiUsageGraph = new Subject<{ x_axis: string[]; y_axis: number[] }>();
  isBlockUnblock = new Subject<{
    status: boolean;
    email: string[];
    type: string;
  }>();


  /**
   * @description This function when called
   * resets the payload we are passing to the
   * `getTableListData()` API.
   */
  resetDataTablePayload() {
    this.defaultPayload = {
      startRow: 0,
      endRow: 50,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: {},
      sortModel: []
    };
  }

  getDataTableLists(
    tableEndPoint: string,
    filterModels?: IFilterModel,
    param?: GridReadyEvent
  ): void {
    this.dataTableParams = param;
    const dataSource = {
      getRows: (params: IServerSideGetRowsParams): void => {
        this.loading = true;
        this.disableRefreshingBtn.set(true);
        this.selectAllCheckbox.set(false);
        this.showNoResult = false;
        const requestBody = { ...params.request };

        this.dataTableRepository
          .getTableListData(tableEndPoint, requestBody)
          .subscribe((response) => {
            this.rowCounts = response.rowCount;
            this.rowData = response?.rowData;
            if (response.rowCount === 0) {
              this.handleNoRowsOverlay(params, response);
            } else {
              this.handleRowsResponse(params, response);
            }
          });
      }
    };
this.dataTableParams?.api?.setGridOption('serverSideDatasource', dataSource);  
}

  private handleNoRowsOverlay(
    params: IServerSideGetRowsParams,
    response: IDataTableResponse
  ): void {
    this.loading = false;
    this.refreshingBtn.set(false);
    this.disableRefreshingBtn.set(true);
    this.showNoResult = true;
    params?.api.hideOverlay();
    params?.api.showNoRowsOverlay();
    this.updateRowData(params, response);
  }

  private handleRowsResponse(
    params: IServerSideGetRowsParams,
    response: IDataTableResponse
  ): void {
    this.loading = false;
    params?.api.hideOverlay();
    this.updateRowData(params, response);
  }


  updateRowData(
    params: IServerSideGetRowsParams,
    response: IDataTableResponse
  ): void {
    this.refreshingBtn.set(false);
    this.disableRefreshingBtn.set(false);
    this.showNoResult = false;
    params.success({
      rowData: response.rowData,
      rowCount: response.rowCount
    });
  }

  blockUnblock(email: string[], id: string, type: string): void {
    const emailObjects = email.map((emailItem) => ({ email: emailItem }));
    this.dataTableRepository
      .blockUnblock(emailObjects, id)
      .subscribe((res: ResponseType[]) => {
        res.forEach((response: ResponseType) => {
          if (response.status_code === 200) {
            this.isBlockUnblock.next({
              status: true,
              email,
              type
            });
          }
        });
      });
  }

  deleteRow(params: IcellRendererParams) {
    this.dataTableRepository.deleteRow(params).subscribe((res: unknown) => {
      if (res) {
        this.refreshDataTable(params.context.tableUrl, this.dataTableParams);
      }
    });
  }

  /**
   * @description This function sets the refreshing button state to true and triggers a data refresh for the specified table.
   */
  refreshDataTable(tableUrl: string, params?: GridReadyEvent) {
    this.refreshingBtn.set(true);
    this.gridApi?.refreshServerSide();
    this.getDataTableLists(tableUrl, {}, params);
  }

  // getSelectedId(params: IcellRendererParams) {
  //   if (this.rowData && params.type === 'response') {
  //     const rowObject = (this.rowData as APILogObject[]).find(
  //       (row) => row.id === params.data.id
  //     );
  //     this.requestResponseBody.set(rowObject);
  //   } else {
  //     this.requestResponseBody.set(undefined);
  //   }
  //   if (params.type === 'showGraph') {
  //     this.dataTableRepository
  //       .getAPIUsageGraphDetails(params.data.endpoint)
  //       .subscribe((res: IAPIUsageGraphResponse) => {
  //         if (res.data.x_axis && res.data.y_axis) {
  //           this.apiUsageGraph.next({
  //             x_axis: res.data.x_axis,
  //             y_axis: res.data.y_axis
  //           });
  //         } else {
  //           this.apiUsageGraph.next({
  //             x_axis: [],
  //             y_axis: []
  //           });
  //         }
  //       });
  //   }
  // }

  ngOnDestroy() {
    this.loading = false;
    this.refreshingBtn.set(false);
    this.disableRefreshingBtn.set(true);
    // this.requestResponseBody.set(undefined);
    this.apiUsageGraph.next({ x_axis: [], y_axis: [] });
  }
}
