import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGrnComponent } from './edit-grn.component';

describe('EditGrnComponent', () => {
  let component: EditGrnComponent;
  let fixture: ComponentFixture<EditGrnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGrnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
