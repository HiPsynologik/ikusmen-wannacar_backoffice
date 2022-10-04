import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsControlComponent } from './results-control.component';

describe('ResultsControlComponent', () => {
  let component: ResultsControlComponent;
  let fixture: ComponentFixture<ResultsControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
