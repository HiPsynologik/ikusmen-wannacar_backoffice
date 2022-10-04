import { Component, OnInit } from '@angular/core';
import { ModalService } from '@shared/services/modal/modal.service';
import { RolesService } from '@shared/services/http/roles.service';
import { ERROR_ROLE_USE, SESSION_EDIT_ROL, SESSION_BACKOFFICE } from '@shared/data/data';
import { Router } from '@angular/router';
import { AuthSessionService } from '@shared/services/auth/auth-session.service';

@Component({
  selector: 'wnbo-users-roles',
  templateUrl: './users-roles.component.html',
  styleUrls: ['./users-roles.component.scss']
})
export class UsersRolesComponent implements OnInit {
  headers:Array<any> = [];
  roles:Array<any> = [];

  create:boolean = false;
  edit:boolean = false;
  list:boolean = false;
  delete:boolean = false;


  constructor(private modalSvc: ModalService, private roleSvc:RolesService, private router:Router, private sessionSvc:AuthSessionService) { 
    let permision = this.sessionSvc.setNameSession(SESSION_BACKOFFICE).getKeySession("front")
    permision = permision.menu.admin;
//update_request", "update_user", "create_user", "list_request", "delete_request", "list_role", "create_role", "delete_role", "delete_user", "list_user", "update_role", "create_request"
    for(let perm of permision)
    {
      if(perm == "create_role")
      {
        this.create = true;
      }
      if(perm == "delete_role")
      {
        this.delete = true;
      }
      if(perm == "update_role")
      {
        this.edit = true;
      }
      if(perm == "list_role")
      {
        this.list = true;
      }
    }
  }

  ngOnInit() {

    let perm

    this.loadPermision();
    this.loadRoles();
  }

  showDeletingPermissionAlert(item) {
    this.modalSvc.setHeigth("439px").setWidth("500px").deletingPermission().afterClosed().toPromise().then(success => {
      if(success)
      {
        let modal = this.modalSvc.loader()
        this.roleSvc.deleteRol(item.role_id).then(complete => {
          modal.close();
          this.modalSvc.success()
          this.loadPermision();
          this.loadRoles();
        }, error =>{
          modal.close();
          if(error.error.message == ERROR_ROLE_USE){
            this.modalSvc.errorDeleteRol();
          }else{

          }

        })
      }
    }, error => {
      console.log(error)
    });
  }

  loadPermision()
  {
    this.roleSvc.getPermissions().then(success => {
      this.headers = [];
      let permision:Array<any> = Object.assign([], success.data);
      for(let index = 0; index < permision.length; index++){
        this.headers.push(permision[index].name)
      }
    }, error =>{
      console.log(error)
    })
  }

  loadRoles()
  {
    this.roles = [];
    this.roleSvc.rolesList().then(success => {
      let roles = success.data;
      for(let index =0; index < roles.length; index++)
      {
        let permision = roles[index].bit_permission;
        roles[index].permision = permision.split('')
      }
      this.roles = roles;
    }, error => {
      console.log(error)
    })
  }

  getClassPermision(item)
  {
    let classCss = "status-0";
    if(item == 1)
    {
      classCss="status-1";
    }
    return classCss;
  }

  goToEdit(rol){
    console.log(rol)
    this.sessionSvc.setNameSession(SESSION_EDIT_ROL).setDataSession(rol);
    this.router.navigate(['/admin/roles/edit']);
  }

}
