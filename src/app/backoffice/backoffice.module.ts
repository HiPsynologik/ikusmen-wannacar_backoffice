import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeRoutingModule } from './backoffice-routing.module';
import { BackofficeComponent } from './backoffice.component';
import { SharedModule } from '../shared/shared.module';

import { IncomeProofDocumentValidationComponent } from './documentary-validator/components/income-proof-document-validation/income-proof-document-validation.component';
import { PaymentCapacityComponent } from './payment-capacity/payment-capacity.component';
import { ReportsComponent } from './reports/reports.component';

@NgModule({
  declarations: [
    BackofficeComponent,
    PaymentCapacityComponent,
    ReportsComponent,
  ],
  imports:[
    CommonModule,
    SharedModule,
    BackofficeRoutingModule,
  ]
})
export class BackofficeModule { }
