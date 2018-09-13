import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLocationComponent } from './customer-location.component';

describe('CustomerLocationComponent', () => {
  let component: CustomerLocationComponent;
  let fixture: ComponentFixture<CustomerLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
