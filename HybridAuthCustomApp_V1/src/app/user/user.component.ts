import { Component, OnInit } from '@angular/core';
import { AppUser, ApplicationApiService } from '../application-api.service';

import { MsalService } from '../../vendor-modified-dist/msal-angular/msal.service';
import { IdToken } from 'msal/lib-commonjs/IdToken';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public appUser: AppUser;
  public loadingUser: boolean = false;
  private errorMessage: string;
  public errorMessageVisible: boolean = false;

  constructor(
    private applicationApiService: ApplicationApiService,
    private msalService: MsalService
  ) { }

  ngOnInit() {
    let dateNow = new Date();
    console.log('UserComponent OnInit started at: ' + dateNow);

    this.GetAppUserFromApi();

    dateNow = new Date();
    console.log('UserComponent OnInit completed at: ' + dateNow);
  }

  private GetAppUserFromApi = (): void => {
    let dateNow = new Date();
    console.log('GetAppUserFromApi started at: ' + dateNow);

    // start loading message
    this.loadingUser = true;

    let idToken: any = this.msalService._oauthData.idToken;

    if (idToken) {
      const preferred_username = idToken.preferred_username;

      // call service to get values
      this.applicationApiService.getAppUserByNetworkId(preferred_username)
        .subscribe((data: AppUser) => this.appUser = data,
          error => this.GetAppUserFromApiError(error),
          () => this.GetAppUserFromApiSuccess());
    }
  }
  private GetAppUserFromApiSuccess = (): void => {
    let dateNow = new Date();
    console.log('GetAppUserFromApi completed at ' + dateNow + ' without errors');

    // kill loading message
    this.loadingUser = false;
  }
  private GetAppUserFromApiError = (error: any): void => {
    let dateNow = new Date();
    console.log('GetAppUserFromApi stopped at ' + dateNow + ' due to error: ' + error);

    // set error message
    this.errorMessage = error;
    this.errorMessageVisible = true;

    // kill loading message
    this.loadingUser = false;
  }

}
