import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '@shared/services/http/user.service';
import { ModalService } from '@shared/services/modal/modal.service';
import { Router } from '@angular/router';
import { AuthSessionService } from '@shared/services/auth/auth-session.service';

@Component({
  selector: 'wnbo-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {

  public formEmail = new FormGroup({
    email : new FormControl(
      '', 
      [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
      ]
    )
  });

  constructor(
    private userSvc:UserService,
    private modalSvc:ModalService,
    private router:Router,
    private sessionService: AuthSessionService
  ) { }

  ngOnInit() {
  }

  onSubmit(){
    let modal = this.modalSvc.loader();
    console.log(modal);
    this.userSvc.recoveryPassword(this.formEmail.get('email').value).then(success => {     
      this.sessionService.setNameSession('recovery').setDataSession({email: this.formEmail.get('email').value})
      modal.close();
      this.router.navigate(['/auth/email-send']);
    }, error =>{
      console.log(error)
      modal.close();
    })
  }

}
