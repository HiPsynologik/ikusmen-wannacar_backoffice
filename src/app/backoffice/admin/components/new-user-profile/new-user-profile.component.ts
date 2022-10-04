import { Component, OnInit } from '@angular/core';
import { RolesService } from '@shared/services/http/roles.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ModalService } from '@shared/services/modal/modal.service';
import { UserService } from '@shared/services/http/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wnbo-new-user-profile',
  templateUrl: './new-user-profile.component.html',
  styleUrls: ['./new-user-profile.component.scss']
})
export class NewUserProfileComponent implements OnInit {
  rolesList:Array<any> = [];
  formCreateUser:FormGroup;
  constructor(private rolesSvc:RolesService, private formBuilder:FormBuilder, private modalSvc:ModalService,private userSvc:UserService, private router:Router) { }

  ngOnInit() {
    this.makeForm();
    this.getRoles()
  }

  makeForm()
  {
    this.formCreateUser = this.formBuilder.group({
      admin_name: new FormControl('',[Validators.required]),
      admin_role_id: new FormControl('',[Validators.required]),
      admin_enterprise: new FormControl('',[Validators.required]),
      admin_position: new FormControl('',[Validators.required]),
      admin_email: new FormControl('',[Validators.required, Validators.email]),
    });
  }

  
  getRoles()
  {
    this.rolesSvc.rolesList().then(success => {
      this.rolesList = success.data;
    }, error => {
      console.log(error)
    })
  }

  saveUser()
  {
    if(this.formCreateUser.valid)
    {
      let loader = this.modalSvc.loader();
      let params = this.formCreateUser.value; 
      this.userSvc.createUser(params).then(success => {
        loader.close();
        this.formCreateUser.reset()
        this.modalSvc.success().afterClosed().toPromise().then(success => {
          this.router.navigate(['/admin/users']);
        });
      }, error =>{
        loader.close();
        if(error.error.message == "Admin already exists.")
        {
          this.modalSvc.setTextTitle('Ocurrio un error').setTextMessage("El usuario no puede ser registrado debido a que ya existe valida e intenta de nuevo").error()
        }else
        {
          this.modalSvc.setTextTitle('Ocurrio un error').setTextMessage("Servicio no disponible valida e intenta de nuevo").error()
        }

      })
    }
  }

}
