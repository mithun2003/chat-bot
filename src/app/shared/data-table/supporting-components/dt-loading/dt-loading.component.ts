import {
  ColumnState,
  ILoadingCellRendererParams
} from '@ag-grid-community/core';

export class DtLoadingComponent {
  eGui!: HTMLDivElement;

  init(params: ILoadingCellRendererParams) {
    const eGui = document.createElement('div');
    eGui.className = 'w-full h-full mt-2.5';

    params.api.getColumnState().forEach((column: ColumnState) => {
      if (!column.hide) {
        const cell = document.createElement('div');
        cell.className = 'p-4 inline-block h-10';
        cell.style.width = `${column.width}px`;

        const oval = document.createElement('div');
        oval.className =
          'animate-pulse bg-border-color h-full w-full border-none rounded-lg';

        cell.appendChild(oval);
        eGui.appendChild(cell);
      }
    });

    this.eGui = eGui;
  }

  getGui() {
    return this.eGui;
  }
}
