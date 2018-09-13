import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainmachineComponent } from './mainmachine.component';

describe('MainmachineComponent', () => {
  let component: MainmachineComponent;
  let fixture: ComponentFixture<MainmachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainmachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainmachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
