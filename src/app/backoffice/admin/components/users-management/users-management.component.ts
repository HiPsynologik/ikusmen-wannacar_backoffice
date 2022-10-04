import { Component, OnInit } from '@angular/core';
import { ModalService } from '@shared/services/modal/modal.service';
import { UserService } from '@shared/services/http/user.service';
import { error } from 'protractor';
import { AuthSessionService } from '@shared/services/auth/auth-session.service';
import { SESSION_EDIT_USER, SESSION_BACKOFFICE } from '@shared/data/data';
import { Router } from '@angular/router';

@Component({
  selector: 'wnbo-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent implements OnInit {
  userList:Array<any> =[];
  constructor(private modalSvc: ModalService, private userSvc:UserService, private sessionSvc:AuthSessionService, private router:Router) { }


  create:boolean = false;
  editScreen:boolean = false;
  list:boolean = false;
  delete:boolean = false;


  ngOnInit() {
    this.loadUser();

    let permision = this.sessionSvc.setNameSession(SESSION_BACKOFFICE).getKeySession("front")
    permision = permision.menu.admin;
    for(let perm of permision)
    {
      if(perm == "create_user")
      {
        this.create = true;
      }
      if(perm == "delete_user")
      {
        this.delete = true;
      }
      if(perm == "update_user")
      {
        this.editScreen = true;
      }

      if(perm == "list_user")
      {
        this.list = true;
      }
    }
  }

  edit(user)
  {
    this.sessionSvc.setNameSession(SESSION_EDIT_USER).setDataSession(user);
    this.router.navigate(['/admin/users/edit']);
  }

  classValidUser(user)
  {
    let classCss = "status-0";
    if(user.has_credentials)
    {
      classCss = "status-1"
    }
    return classCss;
  }

  showDeletingUserAlert(user) {

    let modalDelete = this.modalSvc.setHeigth("439px").setWidth("500px").deletingUser();
    modalDelete.afterClosed().toPromise().then(close => {
      if(close)
      {
        console.log(user)
        let loader = this.modalSvc.loader();
        this.userSvc.deleteUser(user.email).then(success =>{
          loader.close();
          this.modalSvc.success();
          this.loadUser()
        }, error =>{
          loader.close();
          this.modalSvc.setTextTitle('Ocurrio un error').setTextMessage("Servicio no disponible valida e intenta de nuevo").error()
          console.log(error)
        })
      }
    })
  } 

  loadUser()
  {
    this.userSvc.getUserList().then(success => {
      this.userList = success.data;
      //console.log(this.userList)
    }, error => {
      console.log(error)
    })
  }

}
