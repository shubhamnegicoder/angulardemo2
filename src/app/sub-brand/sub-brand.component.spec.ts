import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubBrandComponent } from './sub-brand.component';

describe('SubBrandComponent', () => {
  let component: SubBrandComponent;
  let fixture: ComponentFixture<SubBrandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubBrandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
