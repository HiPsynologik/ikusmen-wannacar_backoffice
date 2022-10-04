import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '@shared/services/modal/modal.service';
import { BoardsService } from '@shared/services/http/boards.services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SimulatorService } from '@shared/services/http/simulator.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'wnbo-resume-validation',
  templateUrl: './resume-validation.component.html',
  styleUrls: ['./resume-validation.component.scss']
})
export class ResumeValidationComponent implements OnInit, OnDestroy {
  private keyDownreditAmount = new Subject<string>();
  private cardId: string;
  public resumeNavigation = ['/analyst/payment-capacity/', '/validator/document-list/', '/analyst/results/'];
  public requestId: string;
  public prospectInfo: any;
  public dataForm: FormGroup;
  public sliderAmount;
  public creditData: any = {};
  public sliderOpts: any = {};
  public userProgressPercent = 100;
  public creditProgress = 100;
  public paymentCapacityrogress = 100;
  public paymentDeadLineOptions = [];
  public interestOptions = [];
  public cardStatus = { label: '', class: '' };
  private subsCreditAmount: any;
  private routSubs: any;
  public paymentCapacity = 0;

  constructor(
    private modalSvc: ModalService,
    private boardSvc: BoardsService,
    private fb: FormBuilder,
    private simulatorService: SimulatorService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.boardSvc.setIsResumeView = true;
    this.dataForm = this.fb.group({
      comments: [''],
      creditAmount: [],
      interestRate: [0],
      paymentDeadline: []
    });
    this.subsCreditAmount = this.keyDownreditAmount.pipe(
      debounceTime(900))
      .subscribe((event: any) => {
        console.log('event', event)
        this.dataForm.controls.creditAmount.patchValue(event.value);
        this.calculatePayment();
      });
    this.routSubs = this.activatedRoute.params.subscribe(params => {
      this.cardId = params['id'];
      this.requestId = params['request'];
    });
    this.cardStatus = this.boardSvc.getCardStatus;
    this.getProduct();
    this.getProspectInfo();
    this.getPaymentProgress();
  }

  async getPaymentProgress() {
    try {
      var loader = this.modalSvc.loader();
      const resp = await this.boardSvc.requestPaymentCapacityProgress(this.requestId);
      this.paymentCapacity = resp.data.payment_capacity;
      if (loader) { loader.close() };
    } catch (error) {
      if (loader) { loader.close() };
    }
  }

  async calculatePayment() {
    try {
      var loader = this.modalSvc.loader();
      const body = {
        email_user: this.prospectInfo.email,
        credit_amount: Number(this.dataForm.controls.creditAmount.value),
        credit_interest_rate: Number(this.dataForm.controls.interestRate.value),
        credit_period_payment: Number(this.dataForm.controls.paymentDeadline.value)
      }
      console.log('se calcula el pago')
      console.log(body)
      const resp = await this.boardSvc.requestCalculatePayment(body);
      console.log(resp)
      this.creditData.credit_amount = resp.data.credit_amount;
      this.creditData.credit_monthly_payment = resp.data.credit_monthly_payment;
      this.creditData.credit_down_payment = resp.data.credit_down_payment;
      this.creditData.credit_period_payment = resp.data.credit_period_payment;
      if (loader) { loader.close(); }
    } catch (error) {
      if (loader) { loader.close(); }
    }
  }

  async getProspectInfo() {
    let loader = this.modalSvc.loader();
    try {
      const email = this.boardSvc.getProspectEmail;
      const resp = await this.boardSvc.getDataProspect(email);
      if (resp.data.credit_interest_rate) {
        this.dataForm.controls.interestRate.patchValue(resp.data.credit_interest_rate);
      }
      this.dataForm.controls.creditAmount.patchValue(resp.data.credit_amount);
      this.dataForm.controls.paymentDeadline.patchValue(resp.data.credit_period_payment);
      this.sliderAmount = resp.data.credit_amount;
      this.creditData.credit_amount = resp.data.credit_amount;
      this.creditData.credit_monthly_payment = resp.data.credit_monthly_payment;
      this.creditData.credit_down_payment = resp.data.credit_down_payment;
      this.creditData.credit_period_payment = resp.data.credit_period_payment;
      this.sliderOpts.max = resp.data.credit_amount;
      this.prospectInfo = resp.data;
      console.log(this.prospectInfo)
      loader.close();
      this.calculatePayment();
    } catch (error) {
      loader.close();
    }
  }

  async getProduct() {
    try {
      const resp = await this.simulatorService.getFactoryCredit();
      this.interestOptions = resp.data.interest_rates;
      if (this.dataForm.controls.interestRate.value == 0) {
        this.dataForm.controls.interestRate.patchValue(this.interestOptions[0]);
      }
      this.paymentDeadLineOptions = resp.data.periods_payment;
      this.sliderOpts.min = resp.data.loan_amount.min;
      this.sliderOpts.step = resp.data.loan_amount.min;
    } catch (error) {
      console.log(error);

    }
  }

  goTo(route) {
    this.router.navigate([route + this.cardId + '/' + this.requestId], { queryParams: { prev: 'resume' } });
  }

  backToBoard() {
    this.router.navigate(['/analyst']);
  }

  openModalAction(opt) {
    // 2 - aprobar, 3- rechazar
    var message = 'Estás a punto de ' + ((opt == 2) ? 'aprobar ' : 'rechazar ') + 'el crédito.';
    var modal = this.modalSvc.setParams(message).continue();
    modal.afterClosed().subscribe((resp) => {
      if (resp) {
        this.approve(opt);
      }
    })
  }

  async approve(opt) {
    try {
      var form  = this.dataForm.value
      var loader = this.modalSvc.loader();
      const body: any = {
        status: (opt == 2) ? 'approved' : 'rejected',
        request_id: this.requestId,
        section: 'credit_analyst',
        email_user: this.boardSvc.getProspectEmail,
        credit_amount: Number(form.creditAmount),
        credit_down_payment: Number(this.creditData.credit_down_payment),
        credit_interest_rate: Number(form.interestRate),
        credit_monthly_payment: Number(this.creditData.credit_monthly_payment),
        credit_period_payment: Number(form.paymentDeadline)
      };
      if (form.comments != '') {
        body.additional_comment_credit = this.dataForm.controls.comments.value;
      }
      console.log(body);
      const resp = await this.boardSvc.requestApproveResults(body);
      console.log(resp);
      loader.close();
      this.backToBoard();
    } catch (error) {
      loader.close();
    }
  }

  ngOnDestroy() {
    if (this.routSubs) { this.routSubs.unsubscribe(); }
    if (this.subsCreditAmount) { this.subsCreditAmount.unsubscribe(); }
  }

}
