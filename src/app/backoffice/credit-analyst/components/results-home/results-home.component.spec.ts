import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsHomeComponent } from './results-home.component';

describe('ResultsHomeComponent', () => {
  let component: ResultsHomeComponent;
  let fixture: ComponentFixture<ResultsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
