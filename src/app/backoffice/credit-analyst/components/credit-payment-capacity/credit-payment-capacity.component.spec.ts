import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPaymentCapacityComponent } from './credit-payment-capacity.component';

describe('CreditPaymentCapacityComponent', () => {
  let component: CreditPaymentCapacityComponent;
  let fixture: ComponentFixture<CreditPaymentCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditPaymentCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditPaymentCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
