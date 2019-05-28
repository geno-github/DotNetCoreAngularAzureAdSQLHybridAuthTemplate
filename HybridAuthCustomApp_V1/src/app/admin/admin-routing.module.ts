import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppUsersDisplayComponent } from './app-users-display/app-users-display.component';
import { AppUserDetailComponent } from './app-user-detail/app-user-detail.component';
import { AuthAdminUserGuardService } from '../auth/auth-admin-user-guard.service';

const routes: Routes = [
  {
    path: 'app-users',
    component: AppUsersDisplayComponent,
    canActivate: [AuthAdminUserGuardService]
  },
  {
    path: 'app-user',
    component: AppUserDetailComponent,
    canActivate: [AuthAdminUserGuardService]
  },
  {
    path: 'app-user/:userId',
    component: AppUserDetailComponent,
    canActivate: [AuthAdminUserGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
