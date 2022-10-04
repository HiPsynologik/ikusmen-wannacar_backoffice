import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '@shared/shared.module';
import { UsersManagementComponent } from './components/users-management/users-management.component';
import { UsersRolesComponent } from './components/users-roles/users-roles.component';

import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NewUserProfileComponent } from './components/new-user-profile/new-user-profile.component';
import { NewUserRoleComponent } from './components/new-user-role/new-user-role.component';
import { EditUserProfileComponent } from './components/edit-user-profile/edit-user-profile.component';
import { EditUserRoleComponent } from './components/edit-user-role/edit-user-role.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AdminComponent,
    UsersManagementComponent,
    UsersRolesComponent,
    NewUserProfileComponent,
    NewUserRoleComponent,
    EditUserProfileComponent,
    EditUserRoleComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),

  ]
})
export class AdminModule { }
