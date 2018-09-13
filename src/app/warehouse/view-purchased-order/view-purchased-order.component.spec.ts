import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPurchasedOrderComponent } from './view-purchased-order.component';

describe('ViewPurchasedOrderComponent', () => {
  let component: ViewPurchasedOrderComponent;
  let fixture: ComponentFixture<ViewPurchasedOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPurchasedOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPurchasedOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
