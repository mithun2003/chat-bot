/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntListComponent } from './ent-list.component';

describe('EntListComponent', () => {
  let component: EntListComponent;
  let fixture: ComponentFixture<EntListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
