import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlanogramComponent } from './view-planogram.component';

describe('ViewPlanogramComponent', () => {
  let component: ViewPlanogramComponent;
  let fixture: ComponentFixture<ViewPlanogramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPlanogramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPlanogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
