import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { forEach } from 'lodash';
import { UserProfile } from './user-profile';
import { UserProfileOrganization } from './user-profile-organization';
import { UserProfileStoreService } from './user-profile-store.service';
import { AuthService } from '../auth/auth.service';
import { UserStoreService } from '../user/user-store.service';
import { MsGraphService } from './ms-graph.service';
import { AppUser } from '../application-api.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private appUser: AppUser;
  public userInitials: string;
  public userProfile: UserProfile;
  public userProfileOrganization: UserProfileOrganization;
  public userProfilePhotoUrl: SafeUrl;

  constructor(
    private userProfileStore: UserProfileStoreService,
    private userStoreService: UserStoreService,
    private msGraphService: MsGraphService,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit() {
    let dateNow = new Date();
    console.log('UserProfileComponent ngOnInit started at: ' + dateNow);
    // initialize flag values

    // initialize variable values

    // subscribe to observables from store
    this.userProfileStore.userProfileObservable$.subscribe(data => {
      if (data) {
        this.userProfile = data;

        // handle user initials
        const displayNameSplit = this.userProfile.displayName.split(' ');
        for (let i = 1; i >= 0; i--) {
          if (this.userInitials) {
            this.userInitials = this.userInitials + displayNameSplit[i].charAt(0);
          } else {
            this.userInitials = displayNameSplit[i].charAt(0);
          }
        }

        // check displayName and companyname
        this.CheckCompanyAndDisplayName();
      }
    });
    this.userProfileStore.userProfilePhotoUrlObservable$.subscribe(data => {
      if (data) {
        this.userProfilePhotoUrl = data;
      }
    });
    this.userProfileStore.userProfileOrganizationObservable$.subscribe(data => {
      if (data) {
        this.userProfileOrganization = data;
      }
    });

    dateNow = new Date();
    console.log('UserProfileComponent ngOnInit completed at: ' + dateNow);
  }

  public LoginButtonClicked = () => {
    let dateNow = new Date();
    console.log('UserProfileComponent LoginButtonClicked started at: ' + dateNow);

    this.authService.login();

    dateNow = new Date();
    console.log('UserProfileComponent LoginButtonClicked completed at: ' + dateNow);
  }

  public LogoutButtonClicked = () => {
    let dateNow = new Date();
    console.log('UserProfileComponent LogoutButtonClicked started at: ' + dateNow);

    this.router.navigate(['./logout']);

    dateNow = new Date();
    console.log('UserProfileComponent LogoutButtonClicked completed at: ' + dateNow);
  }

  public CheckCompanyAndDisplayName = () => {
    let dateNow = new Date();
    console.log('UserProfileComponent CheckCompanyAndDisplayName started at: ' + dateNow);

    this.userStoreService.GetUser().then(data => {
      // get user and check user.displayName
      if (data) {
        this.appUser = data;
        if (!(this.appUser.displayName) || this.appUser.displayName === '') {
          this.appUser.displayName = this.authService.getFriendlyName;
        }
      }

      // check user.companyName
      if (!(this.appUser.companyName) || this.appUser.companyName === '') {
        this.msGraphService.GetCompanyName().subscribe(data => {
          if (data) {
            this.appUser.companyName = data;
            this.appUser.lastLoggedInDate = new Date();
            this.userStoreService.SilentUpdateAppUser = this.appUser;
          } else {
            this.appUser.lastLoggedInDate = new Date();
            this.userStoreService.SilentUpdateAppUser = this.appUser;
          }
        });
      } else {
        this.appUser.lastLoggedInDate = new Date();
        this.userStoreService.SilentUpdateAppUser = this.appUser;
      }
    });

    dateNow = new Date();
    console.log('UserProfileComponent CheckCompanyAndDisplayName completed at: ' + dateNow);
  }
}
