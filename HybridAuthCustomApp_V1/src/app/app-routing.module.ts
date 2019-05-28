import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { AuthNormalUserGuardService } from './auth/auth-normal-user-guard.service';
import { UserComponent } from './user/user.component';
import { AuthAdminUserGuardService } from './auth/auth-admin-user-guard.service';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthNormalUserGuardService] },
  { path: 'auth', component: AuthComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthNormalUserGuardService] },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canActivate: [AuthAdminUserGuardService],
    canLoad: [AuthAdminUserGuardService]
  },
  { path: '', component: HomeComponent, canActivate: [AuthNormalUserGuardService] },
  { path: '*', component: HomeComponent, canActivate: [AuthNormalUserGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
