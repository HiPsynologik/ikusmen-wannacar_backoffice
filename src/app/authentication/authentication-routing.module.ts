import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';
import { LoginComponent } from './login/login.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { PasswordRecoveryEmailSendedComponent } from './password-recovery-email-sended/password-recovery-email-sended.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { InactiveUserComponent } from './inactive-user/inactive-user.component';
import { TemporarilyLockedUserComponent } from './temporarily-locked-user/temporarily-locked-user.component';
import { ExpiredLinkComponent } from './expired-link/expired-link.component';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent, children: [
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'password-recovery',
        component: PasswordRecoveryComponent
      },
      {
        path: 'new-password',
        component: NewPasswordComponent
      }
    ]
  },
  {
    path: 'email-send',
    component: PasswordRecoveryEmailSendedComponent
  },
  {
    path: 'user-inactive',
    component: InactiveUserComponent
  },
  {
    path: 'user-blocked',
    component: TemporarilyLockedUserComponent
  },
  {
    path: 'expired-link',
    component: ExpiredLinkComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
