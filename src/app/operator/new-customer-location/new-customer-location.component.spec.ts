import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCustomerLocationComponent } from './new-customer-location.component';

describe('NewCustomerLocationComponent', () => {
  let component: NewCustomerLocationComponent;
  let fixture: ComponentFixture<NewCustomerLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCustomerLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCustomerLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
