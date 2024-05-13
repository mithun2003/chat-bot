import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ColDef, DateFilterModel, ICellRendererParams } from '@ag-grid-community/core';

export interface IFloatingFilterComponentParams {
    suppressFilterButton: boolean;
    tableId?: number;
}

export interface IColumnDefFields extends ColDef {
    field: string;
    minWidth?: number;
    headerName?: string;
    floatingFilterComponent?: string;
    filter?: string;
    floatingFilter?: boolean;
    suppressMenu?: boolean;
    floatingFilterComponentParams?: IFloatingFilterComponentParams;
    sortable?: boolean;
    checkboxSelection?: boolean;
    resizable?: boolean;
    headerClass?: string;
    lockPosition?: boolean;
    headerCheckboxSelection?: boolean;
    showDisabledCheckboxes?: boolean;
    maxWidth?: number;
    pinned?: 'left' | 'right';
}

export interface IDtColumnFields {
    /**
     * Id of the column.
     */
    id: string;
    /**
     * Display name of the column.
     */
    name: string;
    /**
     * Disable column by default.
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Column definition.
     */
    colDef: { field: string };
    isChecked: boolean;
}

export interface IDtHeaderElements {
    panelButtons?: {
        name: string;
        id: string;
        options?: { isItButton: boolean };
    }[];
    buttons: {
        name: string;
        id: string;
        icon?: IconProp;
        cssClass: string;
        toolTip?: string;
        includes?: {
            id: string;
            name: string;
            icon: string;
            toolTip?: string;
            cssClass?: string;
        }[];
        RoundIcon?: string;
        borderCss?: string;
        showAfterSelection: boolean;
    }[];
}

export interface IFilter {
    filter: string;
    filterType: string;
    type: string;
}
export interface IFilterModel {
  searchFilterPayload?: { [key: string]: IFilter };
  selectDateRangePayload?: { [key: string]: DateFilterModel };
}

export interface IDefaultPayload {
  filterModel: IFilterModel;
  startRow: number;
  endRow?: number;
  rowGroupCols: [];
  valueCols: [];
  pivotCols: [];
  pivotMode: boolean;
  groupKeys: [];
  sortModel: [];
}

export interface IDataTableResponse {
  rowData: { [key: string]: string | number | object }[];
  rowCount: number | undefined;
}


export interface IcellRendererParams extends ICellRendererParams {
  field: string;
  type: string;
}