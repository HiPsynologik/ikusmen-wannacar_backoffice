import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictumTrackerComponent } from './dictum-tracker.component';

describe('DictumTrackerComponent', () => {
  let component: DictumTrackerComponent;
  let fixture: ComponentFixture<DictumTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DictumTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictumTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
