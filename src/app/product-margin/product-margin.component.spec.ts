import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMarginComponent } from './product-margin.component';

describe('ProductMarginComponent', () => {
  let component: ProductMarginComponent;
  let fixture: ComponentFixture<ProductMarginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductMarginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMarginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
