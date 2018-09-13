import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithoutNavComponent } from './without-nav.component';

describe('WithoutNavComponent', () => {
  let component: WithoutNavComponent;
  let fixture: ComponentFixture<WithoutNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithoutNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithoutNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
