import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditAnalystComponent } from './credit-analyst.component';

describe('CreditAnalystComponent', () => {
  let component: CreditAnalystComponent;
  let fixture: ComponentFixture<CreditAnalystComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditAnalystComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditAnalystComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
