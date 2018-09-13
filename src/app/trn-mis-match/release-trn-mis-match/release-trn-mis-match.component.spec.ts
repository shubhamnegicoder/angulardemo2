import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseTrnMisMatchComponent } from './release-trn-mis-match.component';

describe('ReleaseTrnMisMatchComponent', () => {
  let component: ReleaseTrnMisMatchComponent;
  let fixture: ComponentFixture<ReleaseTrnMisMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseTrnMisMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseTrnMisMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
