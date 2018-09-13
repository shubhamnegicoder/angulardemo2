import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrnMisMatchComponent } from './trn-mis-match.component';

describe('TrnMisMatchComponent', () => {
  let component: TrnMisMatchComponent;
  let fixture: ComponentFixture<TrnMisMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrnMisMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrnMisMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
