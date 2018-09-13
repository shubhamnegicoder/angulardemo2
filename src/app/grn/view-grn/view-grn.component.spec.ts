import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGrnComponent } from './view-grn.component';

describe('ViewGrnComponent', () => {
  let component: ViewGrnComponent;
  let fixture: ComponentFixture<ViewGrnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGrnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
