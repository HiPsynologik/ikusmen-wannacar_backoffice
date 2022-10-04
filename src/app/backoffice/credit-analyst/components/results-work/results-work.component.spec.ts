import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsWorkComponent } from './results-work.component';

describe('ResultsWorkComponent', () => {
  let component: ResultsWorkComponent;
  let fixture: ComponentFixture<ResultsWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
