import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';

import { findIndex } from 'lodash';
import { UserStoreService } from '../user/user-store.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminUserGuardService implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private authService: AuthService,
    private userStore: UserStoreService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // check if user is authenticated
    if (this.authService.isAuthenticated) {
      // check if user is already authorized
      if (this.userStore.isHybridAuthenticated && (this.userStore.GetUserRoleName === 'AdminUser')) {
        console.log('Admin User guard passed.');
        return true;
      }
    } else {
      // authorization failed on initial check, so redirect to authentication page with the return url
      this.router.navigate(['/auth'], { queryParams: { returnLink: state.url } });
      console.log('Admin User guard failed, no user.');
      return false;
    }

    // authorization failed on initial check, so redirect to authentication page with the return url
    this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url, roleRequested: 'admin' } });
    console.log('Admin User guard failed, not authenticated.');
    return false;
  }

  canLoad(route: Route): boolean {
    // check if user is authenticated
    if (this.authService.isAuthenticated) {
      // check if user is already authorized
      if (this.userStore.isHybridAuthenticated && (this.userStore.GetUserRoleName === 'AdminUser')) {
        return true;
      }
    } else {
      return false;
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(childRoute, state);
  }

}