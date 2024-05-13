import { Component, inject } from '@angular/core';
import { IFloatingFilterParams } from '@ag-grid-community/core';
import { AgFloatingFilterComponent } from '@ag-grid-community/angular';
import { DataTableService } from '../../service/data-table.service';
import { DateRangePickerComponent } from '../../../../shared/components/date-range-picker/date-range-picker.component';

/**
 * Component for handling date range selection with Angular Material's datepicker.
 *  * @implements {AgFloatingFilterComponent}
 */
@Component({
  selector: 'app-dt-date-range',
  template: `<app-date-range-picker
    class="date-picker"
    (dateEmitter)="filterByDate($event)"
    [customClass]="'!h-6 !w-24 border-none bg-white mb-2'"
  ></app-date-range-picker>`,
  standalone: true,
  imports: [DateRangePickerComponent]
})
export class DtDateRangeComponent implements AgFloatingFilterComponent {
  previousFilter: { startDate: string; endDate: string } | undefined =
    undefined;

  dataTableService = inject(DataTableService);
  /**
   * Called by the grid when the parent filter model has changed.
   * @override
   */
  onParentModelChanged(): void {
    // throw new Error('Method not implemented.');
  }

  params: IFloatingFilterParams | undefined;

  currentValue = '';

  /**
   * Initializes the floating filter component with the provided parameters.
   * @param {IFloatingFilterParams} params - The parameters for the floating filter.
   * @override
   */
  agInit(params: IFloatingFilterParams): void {
    this.params = params;
  }

  /**
   * Filters activities based on the selected date range.
   *
   * @param {{ startDate: string; endDate: string }} event - The selected date range.
   * @memberof ActivityListComponent
   */
  filterByDate(event: { startDate: string; endDate: string }) {
    if (this.previousFilter === event) {
      return;
    }

    if (event.startDate && event.endDate) {
      const dateRangeFilterValues = {
        dateFrom: `${event.startDate} 00:00:00`,
        dateTo: `${event.endDate} 00:00:00`,
        type: 'inRange'
      };

      // const filterName = 'email' as string;
      const filterName = this.params?.filterParams.colDef.field as string;

      const selectDateRangePayload = {
        [filterName]: {
          ...dateRangeFilterValues
        }
      };

      /**
       * @description -  Dispatches an action to update the selected filter in the data table state.
       */
      const tableName = this.params?.context.tableUrl;
      const params = this.dataTableService.dataTableParams;
      const fieldName = String(this.params?.column?.getColId());

      this.dataTableService.getDataTableLists(
        tableName,
        selectDateRangePayload,
        params
      );
      const filterComponent = this.params?.api.getFilterInstance(fieldName);
      filterComponent?.setModel(dateRangeFilterValues);
      this.params?.api.onFilterChanged();
      this.previousFilter = event;
    }
  }
}
