import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlBoardComponent } from './components/control-board/control-board.component';
import { RequestViewComponent } from './components/request-view/request-view.component';
import { CreditPaymentCapacityComponent } from './components/credit-payment-capacity/credit-payment-capacity.component';
import { ResultsControlComponent } from './components/results-control/results-control.component';
import { ResumeValidationComponent } from './components/resume-validation/resume-validation.component';



const routes: Routes = [
  {path: "", component: ControlBoardComponent},
  {path: "payment-capacity/:id/:request", component: CreditPaymentCapacityComponent},
  {path: "results/:id/:request", component: ResultsControlComponent},
  {path: "resume/:id/:request", component: ResumeValidationComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditAnalystRoutingModule { }
