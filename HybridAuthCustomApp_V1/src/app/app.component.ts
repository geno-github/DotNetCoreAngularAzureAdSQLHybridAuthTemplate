import { Component, OnInit, OnDestroy } from '@angular/core';

import { BroadcastService } from '../vendor-modified-dist/msal-angular/broadcast.service';

import { Subscription } from 'rxjs';
import { UserProfileStoreService } from './user-profile/user-profile-store.service';
import { UserStoreService } from './user/user-store.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  // initialize variables
  private subscription: Subscription;

  constructor(
    private broadcastService: BroadcastService,
    private authService: AuthService,
    private userStore: UserStoreService
  ) { }

  ngOnInit(): void {
    let dateNow = new Date();
    console.log('AppComponent OnInit started at: ' + dateNow);

    // execute methods to fill dropdown/choice data

    // initialize flag values

    // get data for dropdowns

    // register callback for the msal service
    this.broadcastService.subscribe('msal:loginFailure', (payload) => {
      console.log('MSAL: Failed to get ID Token: ' + JSON.stringify(payload));
      this.authService.authHardFailed = true;
    });

    this.broadcastService.subscribe('msal:loginSuccess', (payload) => {
      console.log('MSAL: ID Token Successfully obtained: ' + JSON.stringify(payload));
    });

    this.broadcastService.subscribe('msal:acquireTokenSuccess', (payload) => {
      console.log('MSAL: Access token successfully obtained: ' + JSON.stringify(payload));
    });

    this.broadcastService.subscribe('msal:acquireTokenFailure', (payload) => {
      console.log('MSAL: Failed to get Access token: ' + JSON.stringify(payload));
      // check for error messages
      if (payload && (JSON.stringify(payload).indexOf("login_required") !== -1 || JSON.stringify(payload).indexOf("consent_required") !== -1 || JSON.stringify(payload).indexOf("interaction_required") != -1)) {
        // soft fail - need to login again
        this.authService.authSoftFailed = true;
        this.userStore.ResetAppUser();
      } else if (payload && (JSON.stringify(payload).indexOf("AADSTS500011: The resource principal named") !== -1)) {
        // admin consent problem
        this.authService.authConsentFailed = true;
        this.userStore.ResetAppUser();
      } else if (payload && (JSON.stringify(payload).indexOf("multiple_matching_tokens_detected") !== -1)) {
        // ignore this message
      } else {
        this.authService.authHardFailed = true;
        this.userStore.ResetAppUser();
      }
    });

    dateNow = new Date();
    console.log('AppComponent OnInit completed at: ' + dateNow);
  }

  ngOnDestroy() {
    this.broadcastService.getMSALSubject().next(1);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
