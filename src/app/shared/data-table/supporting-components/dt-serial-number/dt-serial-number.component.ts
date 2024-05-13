import { Component } from '@angular/core';

export interface Params {
  node: {
    rowIndex: number;
  };
}

@Component({
  selector: 'app-serial-number-cell-renderer',
  template: `<span>{{ params.node.rowIndex + 1 }}</span>`
})
export class DtSerialNumberComponent {
  params: Params = { node: { rowIndex: 0 } };

  agInit(params: Params): void {
    this.params = params;
  }
}
