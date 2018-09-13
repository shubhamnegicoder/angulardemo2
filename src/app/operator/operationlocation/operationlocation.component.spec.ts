import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationlocationComponent } from './operationlocation.component';

describe('OperationlocationComponent', () => {
  let component: OperationlocationComponent;
  let fixture: ComponentFixture<OperationlocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationlocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationlocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
