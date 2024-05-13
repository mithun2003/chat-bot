import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtDateRangeComponent } from './dt-date-range.component';

describe('DtDateRangeComponent', () => {
  let component: DtDateRangeComponent;
  let fixture: ComponentFixture<DtDateRangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DtDateRangeComponent]
    });
    fixture = TestBed.createComponent(DtDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
