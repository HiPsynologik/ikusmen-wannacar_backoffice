import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsDocumentsComponent } from './results-documents.component';

describe('ResultsDocumentsComponent', () => {
  let component: ResultsDocumentsComponent;
  let fixture: ComponentFixture<ResultsDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
