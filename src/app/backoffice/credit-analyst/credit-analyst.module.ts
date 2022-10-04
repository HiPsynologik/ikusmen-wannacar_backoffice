import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditAnalystComponent } from './credit-analyst.component';
import { ControlBoardComponent } from './components/control-board/control-board.component';
import { RequestViewComponent } from './components/request-view/request-view.component';
import { SharedModule } from '@shared/shared.module';
import { CreditAnalystRoutingModule } from './credit-analyst-routing.module';
import { CreditPaymentCapacityComponent } from './components/credit-payment-capacity/credit-payment-capacity.component';
import { ResultsControlComponent } from './components/results-control/results-control.component';
import { ResultsWorkComponent } from './components/results-work/results-work.component';
import { ResultsHomeComponent } from './components/results-home/results-home.component';
import { ResultsCallsComponent } from './components/results-calls/results-calls.component';
import { ResultsDocumentsComponent } from './components/results-documents/results-documents.component';
import { DocumentValidationComponent } from './components/document-validation/document-validation.component';
import { ResumeValidationComponent } from './components/resume-validation/resume-validation.component';

@NgModule({
  declarations: [
    CreditAnalystComponent,
    ControlBoardComponent,
    RequestViewComponent,
    CreditPaymentCapacityComponent,
    ResultsControlComponent,
    ResultsWorkComponent,
    ResultsHomeComponent,
    ResultsCallsComponent,
    ResultsDocumentsComponent,
    DocumentValidationComponent,
    ResumeValidationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CreditAnalystRoutingModule
  ]
})
export class CreditAnalystModule { }
