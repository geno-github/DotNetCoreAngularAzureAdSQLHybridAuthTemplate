import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../../environments/environment';

import { AuthService } from '../auth/auth.service';
import { UserStoreService } from '../user/user-store.service';
import { AppUser, UserRole } from '../application-api.service';
import { UserProfileStoreService } from '../user-profile/user-profile-store.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  public pageTitle: string;
  public displayWaitingMessage: boolean;
  public waitingMessage: string;
  public roleRequested: string;
  public returnLink: string;
  public appUser: AppUser;
  public widgetToDisplay: string;
  public adminConsentLink: string;

  constructor(
    public authService: AuthService,
    public userStore: UserStoreService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    let dateNow = new Date();
    console.log('AuthComponent OnInit started at: ' + dateNow);

    // initialize flag values
    this.displayWaitingMessage = false;

    // initialize variable values

    // check for role requested
    if (this.route.snapshot.queryParams['roleRequested']) {
      this.roleRequested = this.route.snapshot.queryParams['roleRequested'];
    }

    // check for return url
    if (this.route.snapshot.queryParams['returnLink']) {
      this.returnLink = this.route.snapshot.queryParams['returnLink'];
    }

    // set initial page state
    this.displayWaitingMessage = true;
    this.pageTitle = 'Authorization Pending:';
    this.waitingMessage = 'Authorization Pending...';
    this.widgetToDisplay = 'Pending';

    // setup subscription for user observable
    this.userStore.appUserObservable$.subscribe(userValue => {
      if (userValue && userValue.userRoleId != 0) {
        this.appUser = userValue;
      }
      this.UserObservableChanged();
    })

    dateNow = new Date();
    console.log('AuthComponent OnInit completed at: ' + dateNow);
  }

  public LoginButtonClicked = (): void => {
    let dateNow = new Date();
    console.log('AuthComponent LoginButtonClicked started at: ' + dateNow);

    this.waitingMessage = 'Logging in... Please wait';
    this.displayWaitingMessage = true;

    this.authService.login();

    dateNow = new Date();
    console.log('AuthComponent LoginButtonClicked completed at: ' + dateNow);
  }

  public UserObservableChanged = (): void => {
    let dateNow = new Date();
    console.log('AuthComponent UserObservableChanged started at: ' + dateNow);

    if (this.authService.authSoftFailed) {
      this.pageTitle = 'Login Needed:';
      this.widgetToDisplay = 'Login';
      this.displayWaitingMessage = false;
    } else if (this.authService.authConsentFailed) {
      this.pageTitle = 'Consent Needed:';
      this.widgetToDisplay = 'ConsentNeeded';
      this.adminConsentLink = environment.msalConfig.adminConsentLink;
      this.displayWaitingMessage = false;
    } else if (this.authService.authHardFailed || this.userStore.hybridAuthFailed) {
      this.widgetToDisplay = 'HardFail';
      this.pageTitle = 'Login Error:';
      this.displayWaitingMessage = false;
    } else if (this.appUser) {
      // check if admin is requested
      if (this.roleRequested && this.roleRequested == 'admin') {  // admin
        if (this.appUser.userRole.roleName == 'AdminUser') {
          this.widgetToDisplay = 'Redirect';
          this.pageTitle = 'Redirect:';
          this.waitingMessage = "Please wait. Redirection in progress...";
          this.Redirect();
        }
      } else if (this.roleRequested && this.roleRequested == 'privileged') {  // privileged
        if (this.appUser.userRole.roleName == 'PrivilegedUser') {
          this.pageTitle = 'Redirect:';
          this.widgetToDisplay = 'Redirect';
          this.waitingMessage = "Please wait. Redirection in progress...";
          this.Redirect();
        }
      } else { // normal user
        if (this.appUser.userRoleId != 0) {
          this.pageTitle = 'Redirect:';
          this.widgetToDisplay = 'Redirect';
          this.waitingMessage = "Please wait. Redirection in progress...";
          this.Redirect();
        } else { // bad user
          this.pageTitle = 'Login Error:';
          this.widgetToDisplay = 'HardFail';
          this.displayWaitingMessage = false;
        }
      }
    } else {
      if (!(this.authService.isAuthenticated)) {  // redirect to login
        this.authService.login();
      } else {
        this.userStore.InitializeUser(); // initialize user
      }
    }

    dateNow = new Date();
    console.log('AuthComponent UserObservableChanged completed at: ' + dateNow);
  }

  public Redirect = (): void => {
    let dateNow = new Date();
    console.log('AuthComponent Redirect started at: ' + dateNow);

    if (this.returnLink) {
      this.router.navigate([this.returnLink]);
    } else {
      this.router.navigate(['/home']);
    }

    dateNow = new Date();
    console.log('AuthComponent Redirect completed at: ' + dateNow);
  }
}