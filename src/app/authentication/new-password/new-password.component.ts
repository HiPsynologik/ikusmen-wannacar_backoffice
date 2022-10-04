import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ModalService } from '@shared/services/modal/modal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from '@shared/services/validations/validation.service';
import { UserService } from '@shared/services/http/user.service';

@Component({
  selector: 'wnbo-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  formNewPassword: FormGroup;
  password;
  validPass = {
    containsUppercase: false,
    containsLowercase: false,
    containsDigit: false,
    withinLengthRange: false,
    containsSpecialChar: false,
    containsKeySequence:  false,
    isValid: false
  }; 
  activeComparePass = false;
  otp;
  messageError:string;
  errorCount:number=0;

  constructor(private formBuilder:FormBuilder, private validationSvc:ValidationService,private modalSvc:ModalService, 
              private router:Router, private activeRoute:ActivatedRoute, private userSvc:UserService) {
                this.activeRoute.queryParams.subscribe(params => {
                  this.otp = params.otp;
                });
            
               }

  ngOnInit() {

    this.makeForm();
  }

  makeForm(){
    this.formNewPassword = this.formBuilder.group({
      password: new FormControl('', [Validators.required, Validators.maxLength(32), Validators.minLength(8)]),
      passwordConfirm: new FormControl('', [Validators.required]),
    },{ validator: this.cmpPass('password', 'passwordConfirm') })
  }

  cmpPass(pass, confirm){
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[pass];
      const matchingControl = formGroup.controls[confirm];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          return;
      }
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
    }
  }

  validPassword(){
    this.validPass = this.validationSvc.isValidPassword(this.formNewPassword.value.password, '', '');
  }

  typeText(){
    console.log(this.formNewPassword.value)
  }
  
  submit(){
    let loader = this.modalSvc.loader();
    let params = {
      "otp": this.otp,
      "password": this.formNewPassword.get('password').value
    }
    this.userSvc.applyResetPassword(params).then(success=> {
      console.log(success);
      if(loader){
        loader.close();
      }
      this.modalSvc.setHeigth("448px").setWidth("754px").passwordChangeSuccess();
      this.router.navigate(['/auth'])
    }, error => {
      this.errorCount++;      
      if(error.error.message)
      {
        this.verifyError(error.error.message)
      }
      console.log(error.error)
      if(loader){
        loader.close();
      }
    })

    this.userSvc.validateUser(params).then(success => {
      console.log(success)
      let modal = this.modalSvc.setHeigth("448px").setWidth("754px").setTextTitle("Activacion de usuario").setTextMessage("La activacion del usuario a sido exitosa").success();
      this.router.navigate(['/auth'])
    }, error => {
      this.errorCount++;
      if(error.error.message)
      {
        this.verifyError(error.error.message)
      }
      if(loader){
        loader.close();
      }
    })
  }

  verifyError(error){
    if(this.errorCount >= 2){
      let modal
      switch(error){
        case 'otp not valid':
          modal = this.modalSvc.setHeigth("448px").setWidth("754px").setTextTitle("Activacion de usuario").setTextMessage("Codigo de activacion es invalido").error();
        break;
        default:
          modal = this.modalSvc.setHeigth("448px").setWidth("754px").setTextTitle("Ocurrion un error").setTextMessage("Servicio no disponible o informacion incorrecta valida e intenta de nuevo").error();
      }
    }
  }

  toVerify(){
    this.router.navigate(['/auth/verify']);
  }

}
