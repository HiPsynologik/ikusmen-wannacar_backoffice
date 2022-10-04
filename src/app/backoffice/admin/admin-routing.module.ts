import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersManagementComponent } from './components/users-management/users-management.component';
import { UsersRolesComponent } from './components/users-roles/users-roles.component';
import { NewUserProfileComponent } from './components/new-user-profile/new-user-profile.component';
import { NewUserRoleComponent } from './components/new-user-role/new-user-role.component';
import { EditUserRoleComponent } from './components/edit-user-role/edit-user-role.component';
import { EditUserProfileComponent } from './components/edit-user-profile/edit-user-profile.component';


const routes: Routes = [
  {path:'users', component: UsersManagementComponent},
  {path:'users/new', component: NewUserProfileComponent},
  {path:'users/edit', component: EditUserProfileComponent},
  {path:'roles', component: UsersRolesComponent},
  {path:'roles/new', component: NewUserRoleComponent},
  {path:'roles/edit', component: EditUserRoleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
