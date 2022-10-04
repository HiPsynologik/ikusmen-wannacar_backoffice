import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SessionService } from '@shared/services/guards/session.service';


const routes: Routes = [
  {
    path: '',
    canActivate: [SessionService],
    loadChildren: () => import('./backoffice/backoffice.module').then(m => m.BackofficeModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
