import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthsessionService } from '@shared/services/auth/authsession.service';
import { Router } from '@angular/router';
import { UserService } from '@shared/services/http/user.service';
import { ModalService } from '@shared/services/modal/modal.service';
import { SESSION_BACKOFFICE } from '@shared/data/data';
import { ValidatorEmail } from '@shared/validators/validator.email';


@Component({
  selector: 'wnbo-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authSvc: AuthsessionService,
    private router: Router,
    private userSvc: UserService,
    private modalSvc: ModalService
  ) { }

  ngOnInit() {
    this.makeForm()
  }

  makeForm() {
    this.formLogin = this.formBuilder.group({
      user: new FormControl('', [Validators.required, ValidatorEmail]),
      pass: new FormControl('', [Validators.required])
    })
  }

  login() {
    let modal = this.modalSvc.loader();
    this.userSvc.login(this.formLogin.value).then(success => {
      success.email = this.formLogin.value.user
      this.authSvc.setNameSession(SESSION_BACKOFFICE).setDataSession(success);
      modal.close();
      setTimeout(()=> {
        this.router.navigate([''])
      },100)
    }, error => {
      modal.close()
      this.modalSvc.setTextMessage('Error en usuario y/o contraseña, valide e intente de nuevo').error();
    })
  }
}
