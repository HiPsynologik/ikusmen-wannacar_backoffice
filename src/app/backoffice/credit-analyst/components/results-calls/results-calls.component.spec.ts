import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsCallsComponent } from './results-calls.component';

describe('ResultsCallsComponent', () => {
  let component: ResultsCallsComponent;
  let fixture: ComponentFixture<ResultsCallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsCallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
