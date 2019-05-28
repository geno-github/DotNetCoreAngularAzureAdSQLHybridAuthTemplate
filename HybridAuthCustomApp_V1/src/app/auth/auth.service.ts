import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

//import { BroadcastService } from '../../vendor-modified-dist/msal-angular/broadcast.service';
import { MsalService } from '../../vendor-modified-dist/msal-angular/msal.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authSoftFailed: boolean = false;
  private _authHardFailed: boolean = false;
  private _authConsentFailed: boolean = false;

  constructor(
    private msalSvc: MsalService
  ) { }

  public login = (): void => {
    let dateNow = new Date();
    console.log('AuthService login started at: ' + dateNow);

    this.msalSvc.loginRedirect()

    dateNow = new Date();
    console.log('AuthService login completed at: ' + dateNow);
  }

  public logout = (): void => {
    let dateNow = new Date();
    console.log('AuthService logout started at: ' + dateNow);

    this.msalSvc.logout();

    dateNow = new Date();
    console.log('AuthService logout completed at: ' + dateNow);
  }

  public get authSoftFailed() {
    if (this._authSoftFailed) {
      return true;
    } else {
      return false;
    }
  }

  public set authSoftFailed (value: boolean) {
    if (value) {
      this._authSoftFailed = true;
    } else {
      this._authSoftFailed = false;
    }
  }

  public get authHardFailed() {
    if (this._authHardFailed) {
      return true;
    } else {
      return false;
    }
  }

  public set authHardFailed (value: boolean) {
    if (value) {
      this._authHardFailed = true;
    } else {
      this._authHardFailed = false;
    }
  }

  public get authConsentFailed() {
    if (this._authConsentFailed) {
      return true;
    } else {
      return false;
    }
  }

  public set authConsentFailed(value: boolean) {
    if (value) {
      this._authConsentFailed = true;
    } else {
      this._authConsentFailed = false;
    }
  }

  public get getFriendlyName (): string {
    let dateNow = new Date();
    console.log('AuthService getFriendlyName started at: ' + dateNow);

    const friendlyNameToReturn = this.msalSvc._oauthData.userName;

    dateNow = new Date();
    console.log('AuthService getFriendlyName completed at: ' + dateNow);

    return friendlyNameToReturn;
  }

  public get getUserName (): string {
    let dateNow = new Date();
    console.log('AuthService getUserName started at: ' + dateNow);

    const userNameToReturn = this.msalSvc._oauthData.userName;

    dateNow = new Date();
    console.log('AuthService getUserName completed at: ' + dateNow);

    return userNameToReturn;
  }

  public get isAuthenticated (): boolean {
    console.log('AuthService isAuthenticated started.');

    if (this.msalSvc._oauthData.idToken && Object.values(this.msalSvc._oauthData.idToken)[0]) {
      console.log('AuthService isAuthenticated completed.  User is successfully authenticated.');

      return true;
    } else {
      console.log('AuthService isAuthenticated completed.  User is NOT successfully authenticated.');

      return false;
    }
  }

  public get loginInProgress (): boolean {
    let dateNow = new Date();
    console.log('AuthService loginInProgress started at: ' + dateNow);

    if (this.msalSvc.loginInProgress()) {
      dateNow = new Date();
      console.log('AuthService loginInProgress completed at: ' + dateNow);

      return true;
    } else {
      dateNow = new Date();
      console.log('AuthService loginInProgress completed at: ' + dateNow);

      return false;
    }

  }
}
