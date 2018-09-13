import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddplanogramComponent } from './addplanogram.component';

describe('AddplanogramComponent', () => {
  let component: AddplanogramComponent;
  let fixture: ComponentFixture<AddplanogramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddplanogramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddplanogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
