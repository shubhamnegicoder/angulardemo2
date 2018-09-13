import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPurchaseReturnComponent } from './view-purchase-return.component';

describe('ViewPurchaseReturnComponent', () => {
  let component: ViewPurchaseReturnComponent;
  let fixture: ComponentFixture<ViewPurchaseReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPurchaseReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPurchaseReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
