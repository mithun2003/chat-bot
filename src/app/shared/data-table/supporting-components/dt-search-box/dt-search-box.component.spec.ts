import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtSearchBoxComponent } from './dt-search-box.component';

describe('DtSearchBoxComponent', () => {
  let component: DtSearchBoxComponent;
  let fixture: ComponentFixture<DtSearchBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DtSearchBoxComponent]
    });
    fixture = TestBed.createComponent(DtSearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
