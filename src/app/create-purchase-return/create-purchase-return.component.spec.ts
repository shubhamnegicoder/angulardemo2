import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePurchaseReturnComponent } from './create-purchase-return.component';

describe('CreatePurchaseReturnComponent', () => {
  let component: CreatePurchaseReturnComponent;
  let fixture: ComponentFixture<CreatePurchaseReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePurchaseReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePurchaseReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
