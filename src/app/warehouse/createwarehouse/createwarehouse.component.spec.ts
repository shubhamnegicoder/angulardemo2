import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatewarehouseComponent } from './createwarehouse.component';

describe('CreatewarehouseComponent', () => {
  let component: CreatewarehouseComponent;
  let fixture: ComponentFixture<CreatewarehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatewarehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatewarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
