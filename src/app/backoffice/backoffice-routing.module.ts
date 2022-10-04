import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackofficeComponent } from './backoffice.component';
import { SessionService } from '@shared/services/guards/session.service';
import { PaymentCapacityComponent } from './payment-capacity/payment-capacity.component';

const routes: Routes = [
  {
    path: '', 
    canActivate: [SessionService],
    component: BackofficeComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./requests/requests.module').then(m => m.RequestsModule)
      },
      {
        path: 'dictum',
        loadChildren: () => import('./dictum/dictum.module').then(m => m.DictumModule)
      },
      {
        path: 'validator',
        loadChildren: () => import('./documentary-validator/documentary-validator.module').then(m => m.DocumentaryValidatorModule)
      },
      {
        path: 'investigator',
        loadChildren: () => import('./investigator/investigator.module').then( m => m.InvestigatorModule)
      },
      {
        path: 'analyst',
        loadChildren: () => import('./credit-analyst/credit-analyst.module').then(m => m.CreditAnalystModule)
      },
      {
        path: 'references',
        loadChildren: () => import('./references/references.module').then(m => m.ReferencesModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'payment-capacity',
        component: PaymentCapacityComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
