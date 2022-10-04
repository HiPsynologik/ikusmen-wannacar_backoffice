import { Component, OnInit } from '@angular/core';
import { AuthSessionService } from '@shared/services/auth/auth-session.service';
import { UserService } from '@shared/services/http/user.service';

@Component({
  selector: 'wnbo-password-recovery-email-sended',
  templateUrl: './password-recovery-email-sended.component.html',
  styleUrls: ['./password-recovery-email-sended.component.scss']
})
export class PasswordRecoveryEmailSendedComponent {

  public email: string;

  constructor(
    private userService: UserService,
    private sessionService: AuthSessionService
  ) {
    let recovery = this.sessionService.setNameSession('recovery').getAllData();
    this.email = recovery.email
  }

  public async resend() {
    try {
      await this.userService.resendEmail({email: this.email, type: 'forgot_password_email'});
    } catch (e) {
      console.error(e)
    }
  }

}
