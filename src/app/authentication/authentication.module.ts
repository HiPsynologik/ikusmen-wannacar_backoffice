import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { SharedModule } from '@shared/shared.module';
import { LoginComponent } from './login/login.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { PasswordRecoveryEmailSendedComponent } from './password-recovery-email-sended/password-recovery-email-sended.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { InactiveUserComponent } from './inactive-user/inactive-user.component';
import { TemporarilyLockedUserComponent } from './temporarily-locked-user/temporarily-locked-user.component';
import { ExpiredLinkComponent } from './expired-link/expired-link.component';


@NgModule({
  declarations: [AuthenticationComponent, LoginComponent, PasswordRecoveryComponent, PasswordRecoveryEmailSendedComponent, NewPasswordComponent, InactiveUserComponent, TemporarilyLockedUserComponent, ExpiredLinkComponent],
  imports: [
    CommonModule,
    SharedModule,
    AuthenticationRoutingModule
  ]
})
export class AuthenticationModule { }
