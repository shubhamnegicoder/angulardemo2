import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductcatelogueComponent } from './productcatelogue.component';

describe('ProductcatelogueComponent', () => {
  let component: ProductcatelogueComponent;
  let fixture: ComponentFixture<ProductcatelogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductcatelogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductcatelogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
