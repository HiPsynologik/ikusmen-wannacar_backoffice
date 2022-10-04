import { Component, OnInit } from '@angular/core';
import { RolesService } from '@shared/services/http/roles.service';
import { ModalService } from '@shared/services/modal/modal.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'wnbo-new-user-role',
  templateUrl: './new-user-role.component.html',
  styleUrls: ['./new-user-role.component.scss']
})
export class NewUserRoleComponent implements OnInit {
  permissionList = [];
  showError: boolean = false;
  permisionSelect: boolean = false;
  formPermision: FormGroup;
  constructor(private roleSvc: RolesService, private modalSvc: ModalService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.loadPermission()
    this.makeForm();
  }

  makeForm() {
    this.formPermision = this.formBuilder.group({
      nameRol: new FormControl('', [Validators.required]),
    })
  }

  loadPermission() {
    let modal = this.modalSvc.loader();
    this.roleSvc.getPermissions().then(success => {
      this.permissionList = Object.assign([], success.data)
      for (let index = 0; index < this.permissionList.length; index++) {
        this.permissionList[index].index = index
        this.permissionList[index].status = false
      }
      modal.close();
    }, error => {
      console.log(error)
      modal.close();
    })
  }

  changeValue(event, item) {
    item.status = event.checked
  }

  savePermision() {
    let count = this.permissionList.filter(items => items.status);
    this.permisionSelect = false;
    if (this.formPermision.valid) {
      if (count.length > 0) {
        this.showError = false;
        let loader = this.modalSvc.loader()
        this.roleSvc.createRol(this.formPermision.value.nameRol, this.toBitString()).then(success => {
          this.modalSvc.success().afterClosed().toPromise().then(success => {
            this.router.navigate(['/admin/roles']);
          })
          loader.close();
        }, error => {
          console.error(error)
          this.modalSvc.setTextMessage('El role ya existe, intenté con otro nombre.').error();
          loader.close();
        })
      } else {
        this.permisionSelect = true;
      }
    } else {
      this.showError = true;
    }

  }

  toBitString() {
    let bits: string = '';
    for (let index = 0; index < this.permissionList.length; index++) {
      let i = this.permissionList[index].status ? 1 : 0;
      bits += i;
    }
    return bits;
  }

  reset() {
    this.loadPermission();
    this.showError = false;
    this.formPermision.reset();
    setTimeout(() => {
      this.router.navigate(['/admin/roles']);
    }, 500);
  }

}
