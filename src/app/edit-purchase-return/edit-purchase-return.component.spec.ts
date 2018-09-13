import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPurchaseReturnComponent } from './edit-purchase-return.component';

describe('EditPurchaseReturnComponent', () => {
  let component: EditPurchaseReturnComponent;
  let fixture: ComponentFixture<EditPurchaseReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPurchaseReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPurchaseReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
