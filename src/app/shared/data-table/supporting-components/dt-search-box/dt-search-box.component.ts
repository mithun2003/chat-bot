import { Component, inject } from '@angular/core';
import { AgFloatingFilterComponent } from '@ag-grid-community/angular';
import { GridReadyEvent, IFloatingFilterParams } from '@ag-grid-community/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTableService } from 'src/app/shared/data-table/service/data-table.service';

/**
 * @description Represents a custom Angular component for a search box.
 * @implements {AgFloatingFilterComponent}
 */
@Component({
  selector: 'app-dt-search-box',
  template: `<input
    type="text"
    [(ngModel)]="currentValue"
    placeholder="Search"
    class="w-full relative bg-white font-inter font-medium outline-none rounded-sm h-6 text-xs border-l-border-color px-1 py-0 border-l border-solid"
    (keydown)="getSearch($event)"
  />`,
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule]
})
export class DtSearchBoxComponent implements AgFloatingFilterComponent {
  previousFilter: string | undefined = undefined;
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
   * Handles the key press event to apply or remove the filter based on the entered value.
   * @param {KeyboardEvent} event - The keyboard event object.
   */
  getSearch(event: KeyboardEvent) {
    if (this.currentValue === this.previousFilter) {
      return;
    }
    if (event.key === 'Enter') {
      const filterMode = this.params?.filterParams.colDef.filter;
      let mode: string;
      if (filterMode === 'agNumberColumnFilter') {
        mode = 'equals';
      } else {
        mode = 'contains';
      }

      const selectBoxFilterValues = {
        filter: this.currentValue,
        filterType: 'text',
        type: mode
      };

      const filterName = this.params?.filterParams.colDef.field as string;

      const filterPayloadForGrid = {
        [filterName]: {
          ...selectBoxFilterValues
        }
      };

      /**
       * @description -  Dispatches an action to update the selected filter in the data table state.
       */
      const tableName = this.params?.context.tableUrl;
      const gridEvent = { ...this.params, type: 'gridReady' };

      this.dataTableService.getDataTableLists(
        tableName,
        filterPayloadForGrid,
        gridEvent as GridReadyEvent
      );
      this.params?.parentFilterInstance((instance) => {
        instance.onFloatingFilterChanged(mode, this.currentValue);
      });
      this.previousFilter = this.currentValue;
    }
  }
}
