import { Component, OnInit, OnDestroy } from '@angular/core';
import { BoardsService } from '@shared/services/http/boards.services';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '@shared/services/modal/modal.service';
import { FormBuilder, FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { SimulatorService } from '@shared/services/http/simulator.service';
import { CatalogService } from '@shared/services/http/catalog.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MONEY_REGEX } from "@shared/data/data";
import { UserService } from '@shared/services/http/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'wnbo-credit-payment-capacity',
  templateUrl: './credit-payment-capacity.component.html',
  styleUrls: ['./credit-payment-capacity.component.scss']
})
export class CreditPaymentCapacityComponent implements OnInit, OnDestroy {
  public userProgressPercent = 37;
  public cardStatus = { label: '', class: '' };
  private cardId: string;
  public requestId: string;
  private routSubs: any;
  private querySubs: any;
  public prospectInfo: any;
  public dataForm: FormGroup;
  public interestOptions = [];
  public paymentDeadLineOptions = [];
  public periodicityOptions = [];
  public creditData: any = {};
  public prospectPanelOpenState;
  public sliderOpts: any = {};
  public sliderAmount;
  private subsCreditAmount: any;
  private keyDownreditAmount = new Subject<string>();
  private subsMonthlyIncome: any;
  private keyDownMonthlyIncome = new Subject<string>();
  public isResumeView = false;
  public validDocuments: any = {
    previus_salary_slips: {},
    antepenultimate_salary_slips: {},
    last_salary_slips: {},
    credit: {}
  };
  public animationDuration = 200;

  constructor(
    private fb: FormBuilder,
    private modalSvc: ModalService,
    private boardSvc: BoardsService,
    private activatedRoute: ActivatedRoute,
    private simulatorService: SimulatorService,
    private catalogService: CatalogService,
    private router: Router,
    private userSvc: UserService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.dataForm = this.fb.group({
      period: [, [Validators.required]],
      incomeOne: [, [Validators.required, Validators.pattern(MONEY_REGEX)]],
      incomeTwo: [, [Validators.required, Validators.pattern(MONEY_REGEX)]],
      incomeThree: [, [Validators.required, Validators.pattern(MONEY_REGEX)]],
      egress: [, [Validators.required, Validators.pattern(MONEY_REGEX)]],
      monthlhyIncome: [0, [Validators.required]],
      paymentCapacity: [0, [Validators.required]],
      creditAmount: [, [Validators.required]],
      interestRate: [0, [Validators.required]],
      paymentDeadline: [, [Validators.required]],
      comments: ['']
    });
    this.cardStatus = this.boardSvc.getCardStatus;
    this.routSubs = this.activatedRoute.params.subscribe(params => {
      this.cardId = params['id'];
      this.requestId = params['request'];
    });
    this.querySubs = this.activatedRoute.queryParams.subscribe((params) => {
      if (params.prev) {
        this.isResumeView = true;
        this.getProgress();
      }
    });
    this.subsCreditAmount = this.keyDownreditAmount.pipe(
      debounceTime(900))
      .subscribe((event: any) => {
        console.log('event', event)
        this.dataForm.controls.creditAmount.patchValue(event.value);
        this.calculatePayment();
      });
    this.subsMonthlyIncome = this.keyDownMonthlyIncome.pipe(
      debounceTime(900)).
      subscribe(() => {
        this.calculateMonthlyIncome();
      })
    
    this.getProduct();
    this.getPeriodicity();
    this.getProspectInfo();
  }

  async getProgress() {
    try {
      var loader = this.modalSvc.loader();
      const form = this.dataForm.controls;
      console.log('en el try')
      const resp = await this.boardSvc.requestPaymentCapacityProgress(this.requestId);
      console.log(resp.data);
      form.incomeOne.patchValue(resp.data.income_one);
      form.incomeTwo.patchValue(resp.data.income_two);
      form.incomeThree.patchValue(resp.data.income_three);
      form.period.patchValue(resp.data.periodicity);
      form.paymentCapacity.patchValue(resp.data.payment_capacity);
      form.monthlhyIncome.patchValue(resp.data.monthly_income);
      form.comments.patchValue(resp.data.additional_comment);
      this.creditData.credit_monthly_payment = resp.data.credit_monthly_payment;
      this.disableForm();
      if (loader) { loader.close() };
    } catch (error) {
      if (loader) { loader.close() };
    }
  }

  disableForm() {
    var form = this.dataForm.controls;
    for (const key in form) {
      if (form.hasOwnProperty(key)) {
        form[key].disable();
      }
    }
  }

  validateAmount() {
    if ((this.dataForm.controls.creditAmount.value > this.sliderOpts.min) && (this.dataForm.controls.creditAmount.value < this.sliderOpts.max)) {
      this.sliderAmount = this.dataForm.controls.creditAmount.value;
      this.calculatePayment();
    } else {
      this.dataForm.controls.creditAmount.setErrors({ validAmount: false });
    }
  }

  calculateMonthlyIncome() {
    if(!this.isResumeView) {
      const form = this.dataForm.controls;
      if (form.period.valid && form.incomeOne.valid && form.incomeTwo.valid && form.incomeThree.valid && form.egress.valid) {
        var loader = this.modalSvc.loader();
        switch (form.period.value) {
          case '30': {
            form.monthlhyIncome.patchValue(((form.incomeThree.value + form.incomeTwo.value + form.incomeOne.value) / 3));
            this.calculatePaymentCapacity();
            loader.close();
            break;
          }
          case '7': {
            form.monthlhyIncome.patchValue((form.incomeOne.value * 4));
            this.calculatePaymentCapacity();
            loader.close();
            break;
          }
          case '15': {
            form.monthlhyIncome.patchValue((form.incomeOne.value * 2));
            this.calculatePaymentCapacity();
            loader.close();
            break;
          }
        }
      }
    }
  }

  calculatePaymentCapacity() {
    var pc = (this.dataForm.controls.monthlhyIncome.value - this.dataForm.controls.egress.value) * 0.4;
    console.log(pc)
    this.dataForm.controls.paymentCapacity.patchValue(pc);
    this.calculatePayment();
  }

  async getPeriodicity() {
    try {
      const resp = await this.catalogService.getCatalogPeriodicity();
      this.periodicityOptions = resp.data;
    } catch (error) {
      console.log(error);
    }
  }

  askBackToBoard() {
    if (!this.isResumeView) {
      const modal = this.modalSvc.releaseCreditMoidal();
      modal.afterClosed().subscribe(resp => {
        if (resp) {
          this.releaseRequest();
          console.log(1);
        }
      })
    } else {
      console.log(2);
      this.router.navigate(['/analyst/resume' + '/' + this.cardId + '/' + this.requestId]);
    }
  }

  async releaseRequest() {
    try {
      var loader = this.modalSvc.loader();
      const resp = await this.boardSvc.requestReleaseFromAnalyst(this.cardId);
      loader.close();
      this.router.navigate(['analyst']);
    } catch (error) {
      console.log(error);
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

  async calculatePayment() {
    if(!this.isResumeView) {
      if (this.dataForm.controls.creditAmount.valid) {
        try {
          const body = {
            email_user: this.prospectInfo.email,
            credit_amount: Number(this.dataForm.controls.creditAmount.value),
            credit_interest_rate: Number(this.dataForm.controls.interestRate.value),
            credit_period_payment: Number(this.dataForm.controls.paymentDeadline.value)
          }
          var loader = this.modalSvc.loader();
          const resp = await this.boardSvc.requestCalculatePayment(body);
          this.creditData.credit_amount = resp.data.credit_amount;
          this.creditData.credit_monthly_payment = resp.data.credit_monthly_payment;
          this.creditData.credit_down_payment = resp.data.credit_down_payment;
          this.creditData.credit_period_payment = resp.data.credit_period_payment;
          if (loader) { loader.close(); }
        } catch (error) {
          if (loader) { loader.close(); }
        }
      }
    } else {
      console.log('no se van a hacer cambios')
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
      this.dataForm.controls.egress.patchValue(resp.data.approximate_monthly_egress);
      this.dataForm.controls.creditAmount.patchValue(resp.data.credit_amount);
      this.sliderAmount = resp.data.credit_amount;
      this.dataForm.controls.paymentDeadline.patchValue(resp.data.credit_period_payment);
      this.creditData.credit_amount = resp.data.credit_amount;
      this.creditData.credit_monthly_payment = resp.data.credit_monthly_payment;
      this.creditData.credit_down_payment = resp.data.credit_down_payment;
      this.creditData.credit_period_payment = resp.data.credit_period_payment;
      this.sliderOpts.max = resp.data.credit_amount;
      this.getDocumntsInfo(resp.data.documents);
      this.prospectInfo = resp.data;
      loader.close();
    } catch (error) {
      if (loader) { loader.close(); }
    }
  }

  private getDocumntsInfo(docArr: Array<Object>) {
    docArr.filter((doc: any) => (doc.status == 'approved')).map((doc: any) => {
      if (doc.type_document == 'previus_salary_slips') {
        this.validDocuments.previus_salary_slips = doc;
        this.validDocuments.previus_salary_slips.downloadName = 'ComprobantePrevio';
      }
      if (doc.type_document == 'antepenultimate_salary_slips') {
        this.validDocuments.antepenultimate_salary_slips = doc;
        this.validDocuments.antepenultimate_salary_slips.downloadName = 'ComprobanteAnterior';
      }
      if (doc.type_document == 'last_salary_slips') {
        this.validDocuments.last_salary_slips = doc;
        this.validDocuments.last_salary_slips.downloadName = 'UltimoComprobante';
      }
    });
    this.requestDocumentImage();
  }

  async requestDocumentImage() {
    for (const key in this.validDocuments) {
      if (this.validDocuments.hasOwnProperty(key) && (this.validDocuments[key].type_document)) {
        try {
          const resp = await this.userSvc.getImageb64ForValidation(this.validDocuments[key].name_document);
          this.validDocuments[key].b64 = (resp.data);

          this.validDocuments[key].isDownloaded = false;
          this.validDocuments[key].showProgress = false;

        } catch (error) {
          this.validDocuments[key].b64 = '';
          console.log(error);
        }
      }
    }
    console.log(this.validDocuments)
  }

  downloadAllDocuments() {
    for (const key in this.validDocuments) {
      if (this.validDocuments.hasOwnProperty(key)) {
        this.downloadDocument(this.validDocuments[key]);
      }
    }
  }

  downloadDocument(pdfDoc) {
    pdfDoc.showProgress = true;
    setTimeout(()=> {
      const linkSource = pdfDoc.b64;
    const downloadLink = document.createElement("a");
    const fileName = pdfDoc.downloadName;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
    pdfDoc.isDownloaded = true;
    pdfDoc.showProgress = false;

    },this.animationDuration)

    
  }

  async approveRequest() {
    if (this.dataForm.valid) {
      try {
        var loader = this.modalSvc.loader();
        const body: any = {
          requestId: this.requestId,
          email_user: this.prospectInfo.email,
          income_one: this.dataForm.controls.incomeOne.value,
          income_two: this.dataForm.controls.incomeTwo.value,
          income_three: this.dataForm.controls.incomeThree.value,
          periodicity: Number(this.dataForm.controls.period.value),
          monthly_income: this.dataForm.controls.monthlhyIncome.value,
          monthly_expenses: Number(this.dataForm.controls.egress.value),
          payment_capacity: this.dataForm.controls.paymentCapacity.value,
          credit_amount: Number(this.dataForm.controls.creditAmount.value),
          credit_interest_rate: Number(this.dataForm.controls.interestRate.value),
          credit_period_payment: Number(this.dataForm.controls.paymentDeadline.value),
          credit_down_payment: Number(this.creditData.credit_down_payment),
          credit_monthly_payment: Number(this.creditData.credit_monthly_payment)
        };
        if(this.dataForm.controls.comments.value != '') {
          body.additional_comment =  this.dataForm.controls.comments.value
        }
        await this.boardSvc.requestAppoveCredit(body);
        loader.close();
        this.router.navigate(['analyst']);
      } catch (error) {
        loader.close();
      }
    }
  }

  ngOnDestroy() {
    if (this.routSubs) { this.routSubs.unsubscribe(); }
    if (this.subsCreditAmount) { this.subsCreditAmount.unsubscribe(); }
    if (this.subsMonthlyIncome) { this.subsMonthlyIncome.unsubscribe(); }
    if (this.querySubs) { this.querySubs.unsubscribe(); }
  }

}
