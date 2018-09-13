import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorComponentComponent } from './operator-component.component';

describe('OperatorComponentComponent', () => {
  let component: OperatorComponentComponent;
  let fixture: ComponentFixture<OperatorComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
