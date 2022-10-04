import { Component, OnInit, OnDestroy } from '@angular/core';
import { RolesService } from '@shared/services/http/roles.service';
import { ModalService } from '@shared/services/modal/modal.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthSessionService } from '@shared/services/auth/auth-session.service';
import { SESSION_EDIT_ROL } from '@shared/data/data';

@Component({
  selector: 'wnbo-edit-user-role',
  templateUrl: './edit-user-role.component.html',
  styleUrls: ['./edit-user-role.component.scss']
})
export class EditUserRoleComponent implements OnInit, OnDestroy {
  permissionList = [];
  showError:boolean= false;
  permisionSelect:boolean=false;
  formPermision:FormGroup;
  constructor(private roleSvc:RolesService, private modalSvc:ModalService, private formBuilder:FormBuilder, private router:Router, private sessioSvc:AuthSessionService) { }

  ngOnInit() {
    this.loadPermission()
    this.makeForm();
  }

  ngOnDestroy()
  {
    this.sessioSvc.setNameSession(SESSION_EDIT_ROL).clearSession();
  }

  makeForm(){
    this.formPermision = this.formBuilder.group({
      nameRol: new FormControl('', [Validators.required]),
    })
  }

  loadSession()
  {
    this.formPermision.get('nameRol').setValue(this.sessioSvc.setNameSession(SESSION_EDIT_ROL).getKeySession("name"));
    let permisionItem = this.sessioSvc.setNameSession(SESSION_EDIT_ROL).getKeySession("permision")
    for(let index=0; index < permisionItem.length;index++){
      this.permissionList[index].status = permisionItem[index] == 1?true:false
    }

  }

  loadPermission()
  {
    let modal = this.modalSvc.loader();
    this.roleSvc.getPermissions().then(success => {
      this.permissionList = Object.assign([], success.data)
      for(let index =0; index< this.permissionList.length; index++)
      {
        this.permissionList[index].index = index
        this.permissionList[index].status = false
      }
      this.loadSession();
      modal.close();
    }, error => {
      console.log(error)
      modal.close();
    })
  }

  changeValue(event, item)
  {
    item.status = event.checked 
  }

  savePermision()
  {
    let count = this.permissionList.filter(items => items.status);
    this.permisionSelect = false;
    if(this.formPermision.valid)
    {
      if(count.length > 0)
      {
        this.showError = false;
        let loader = this.modalSvc.loader()
        let role_id = this.sessioSvc.setNameSession(SESSION_EDIT_ROL).getKeySession("role_id");

        this.roleSvc.updateRol(role_id, this.toBitString()).then(success => {
          loader.close();
          this.modalSvc.success().afterClosed().toPromise().then(success => {
            this.router.navigate(['/admin/roles']);
          });
        }, error => {
          console.log(error)
          loader.close();
        })
      }else{
        this.permisionSelect = true;
      }
    }else
    {
      this.showError = true;
    }

  }

  toBitString()
  {
    let bits:string = '';
    for(let index =0; index< this.permissionList.length; index++)
    {
      let i = this.permissionList[index].status ? 1 : 0;
      bits+=i;
    }    
    return bits;
  }

  reset()
  {
    this.loadPermission();
    this.showError = false;
    this.formPermision.reset();
    setTimeout(() => {
      this.router.navigate(['/admin/roles']);
    }, 500);
  }

}
