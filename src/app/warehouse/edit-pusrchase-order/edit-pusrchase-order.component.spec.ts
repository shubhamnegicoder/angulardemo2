import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPusrchaseOrderComponent } from './edit-pusrchase-order.component';

describe('EditPusrchaseOrderComponent', () => {
  let component: EditPusrchaseOrderComponent;
  let fixture: ComponentFixture<EditPusrchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPusrchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPusrchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
