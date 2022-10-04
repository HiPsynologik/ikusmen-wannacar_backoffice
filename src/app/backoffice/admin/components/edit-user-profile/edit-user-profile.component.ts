import { Component, OnInit } from '@angular/core';
import { RolesService } from '@shared/services/http/roles.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ModalService } from '@shared/services/modal/modal.service';
import { UserService } from '@shared/services/http/user.service';
import { AuthSessionService } from '@shared/services/auth/auth-session.service';
import { SESSION_EDIT_USER } from '@shared/data/data';
import { Router } from '@angular/router';


@Component({
  selector: 'wnbo-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent implements OnInit {
  rolesList:Array<any> = [];
  formCreateUser:FormGroup;
  constructor(private rolesSvc:RolesService, private formBuilder:FormBuilder, private modalSvc:ModalService,private userSvc:UserService, private sessionSvc:AuthSessionService, private router:Router) { 
    this.getRoles()
  }

  ngOnInit() {
    this.makeForm();
    this.loadData();
  }

  makeForm()
  {
    this.formCreateUser = this.formBuilder.group({
      admin_name: new FormControl('',[Validators.required]),
      admin_role: new FormControl('',[Validators.required]),
      admin_enterprise: new FormControl('',[Validators.required]),
      admin_position: new FormControl('',[Validators.required]),
      admin_email: new FormControl('',[Validators.required, Validators.email]),
    });
    return true;
  }

  loadData()
  {
    let user = this.sessionSvc.setNameSession(SESSION_EDIT_USER).getAllData();    
    this.formCreateUser.get('admin_name').setValue(user.name);
    this.formCreateUser.get('admin_role').setValue(user.role.role_id);
    this.formCreateUser.get('admin_enterprise').setValue(user.enterprise);
    this.formCreateUser.get('admin_position').setValue(user.position);
    this.formCreateUser.get('admin_email').setValue(user.email);
    return true;
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
      this.userSvc.updateUser(params).then(success => {
        loader.close();
        this.modalSvc.success().afterClosed().toPromise().then(success => {
          this.router.navigate(['/admin/users']);
        });
      }, error =>{
        loader.close();
        if(error.error.message == "Admin already exists.")
        {
          this.modalSvc.setTextTitle('Ocurrio un error').setTextMessage("El usuario no puede ser registrado debido a que ya existe. Valida e intenta de nuevo").error()
        }else
        {
          this.modalSvc.setTextTitle('Ocurrio un error').setTextMessage("Servicio no disponible. Valida e intenta de nuevo").error()
        }

      })
    }
  }

}
