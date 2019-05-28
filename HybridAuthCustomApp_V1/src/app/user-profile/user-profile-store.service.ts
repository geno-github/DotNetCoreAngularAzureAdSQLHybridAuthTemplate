import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { MsalService } from '../../vendor-modified-dist/msal-angular/msal.service';
import { MsGraphService } from './ms-graph.service';
import { UserProfile } from './user-profile';
import { UserProfileOrganization } from './user-profile-organization';

@Injectable({
  providedIn: 'root'
})
export class UserProfileStoreService {
  private userProfile: UserProfile;
  private userProfilePhotoUrl: SafeUrl;
  private userProfileOrganization: UserProfileOrganization;
  private _userProfileObservable$: BehaviorSubject<UserProfile>;
  private _userProfilePhotoUrlObservable$: BehaviorSubject<SafeUrl>;
  private _userProfileOrganizationObservable$: BehaviorSubject<UserProfileOrganization>;

  private gettingUserProfile = false;
  private gettingUserProfilePhoto = false;
  private gettingUserProfileOrganization = false;

  constructor(
    private msGraphService: MsGraphService,
    private sanitizer: DomSanitizer
  ) {
    // set observables to null initially
    this._userProfileObservable$ = new BehaviorSubject(null);
    this._userProfilePhotoUrlObservable$ = new BehaviorSubject(null);
    this._userProfileOrganizationObservable$ = new BehaviorSubject(null);
  }

  // allow components to subscribe to the observables
  public get userProfileObservable$() {
    return this._userProfileObservable$.asObservable();
  }
  public get userProfilePhotoUrlObservable$() {
    return this._userProfilePhotoUrlObservable$.asObservable();
  }
  public get userProfileOrganizationObservable$() {
    return this._userProfileOrganizationObservable$.asObservable();
  }

  // method to get user profile from service and put it in the store
  public InitializeUserProfile = () => {
    let dateNow = new Date();
    console.log('UserProfileStore InitializeUserProfile called at: ' + dateNow);
    if (!this.gettingUserProfile && !this.userProfile) {
      this.gettingUserProfile = true;
      this.GetUserProfileFromService();
    }
  }

  // method to get user profile photo from service and put it in the store
  public InitializeUserProfilePhoto = () => {
    let dateNow = new Date();
    console.log('UserProfileStore InitializeUserProfilePhoto called at: ' + dateNow);
    if (!this.gettingUserProfilePhoto && !this.userProfilePhotoUrl) {
      this.gettingUserProfilePhoto = true;
      this.GetUserProfilePhotoFromService();
    }
  }

  // method to get user profile organization from service and put it in the store
  public InitializeUserProfileOrganization = () => {
    let dateNow = new Date();
    console.log('UserProfileStore InitializeUserProfileOrganization called at: ' + dateNow);
    if (!this.gettingUserProfileOrganization && !this.gettingUserProfileOrganization) {
      this.gettingUserProfileOrganization = true;
      this.GetUserProfileOrganizationFromService();
    }
  }

  // method to obtain user profile from service
  private GetUserProfileFromService = () => {
    let dateNow = new Date();
    console.log('UserProfileStore GetUserProfileFromService called at ' + dateNow);

    this.msGraphService.GetUserProfile().subscribe(data => {
      this.userProfile = data;
      this.GetUserProfileFromServiceSuccess();
    }
      , error => this.GetUserProfileFromServiceFailed()
    )
  }
  private GetUserProfileFromServiceSuccess = (): void => {
    this.gettingUserProfile = false;

    // set observable
    this._userProfileObservable$.next(this.userProfile);

    // initialize photo
    this.InitializeUserProfilePhoto();

    // initialize profile organization
    this.InitializeUserProfileOrganization();

    let dateNow = new Date();
    console.log('UserProfileStore GetUserProfileFromService completed at ' + dateNow + ' without errors');
  }
  private GetUserProfileFromServiceFailed = (): void => {
    this.gettingUserProfile = false;
    let dateNow = new Date();
    console.log('UserProfileStore GetUserProfileFromService failed at ' + dateNow + ' without errors');
  }

  // method to obtain user profile photo from service
  private GetUserProfilePhotoFromService = () => {
    let dateNow = new Date();
    console.log('UserProfileStore GetUserProfilePhotoFromService called at ' + dateNow);

    // preflight - check if there is a photo
    this.msGraphService.CheckUserProfilePhoto().subscribe(
      success => {  // there is a photo
        if (success) {
          this.msGraphService.GetUserProfilePhoto().subscribe(data => {
            if (data) {
              this.userProfilePhotoUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
              this.GetUserProfilePhotoFromServiceSuccess();
            } else {
              this.GetUserProfilePhotoBetaFromService()
            }
          }
            , error => this.GetUserProfilePhotoFromServiceFailed()
            , () => this.gettingUserProfilePhoto = false
          );
        } else {
          this.gettingUserProfilePhoto = false;
        }
      }
      , error => this.GetUserProfilePhotoFromServiceFailed()
      , () => this.gettingUserProfilePhoto = false
    )
  }
  private GetUserProfilePhotoBetaFromService = () => {
    let dateNow = new Date();
    console.log('UserProfileStore GetUserProfilePhotoBetaFromService called at ' + dateNow);

    this.msGraphService.GetUserProfilePhotoBeta().subscribe(data => {
      if (data) {
        this.userProfilePhotoUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
        this.GetUserProfilePhotoFromServiceSuccess();
      }
    }
      , error => this.GetUserProfilePhotoFromServiceFailed()
      , () => this.gettingUserProfilePhoto = false
    )
  }
  private GetUserProfilePhotoFromServiceSuccess = (): void => {

    // set observable
    this._userProfilePhotoUrlObservable$.next(this.userProfilePhotoUrl);

    let dateNow = new Date();
    console.log('UserProfileStore GetUserProfilePhotoFromService completed at ' + dateNow + ' without errors');
  }
  private GetUserProfilePhotoFromServiceFailed = (): void => {
    this.gettingUserProfilePhoto = false;
    let dateNow = new Date();
    console.log('UserProfileStore GetUserProfilePhotoFromService failed at ' + dateNow + ' without errors');
  }

  // method to obtain user profile organization from service
  private GetUserProfileOrganizationFromService = () => {
    let dateNow = new Date();
    console.log('UserProfileStore GetUserProfileOrganizationFromService called at ' + dateNow);

    this.msGraphService.GetUserProfileOrganizations().subscribe(data => {
      this.userProfileOrganization = data.value[0];
      this.GetUserProfileOrganizationFromServiceSuccess();
    }
      , error => this.GetUserProfileOrganizationFromServiceFailed()
    )
  }
  private GetUserProfileOrganizationFromServiceSuccess = (): void => {
    this.gettingUserProfile = false;

    // set observable
    this._userProfileOrganizationObservable$.next(this.userProfileOrganization);

    let dateNow = new Date();
    console.log('UserProfileStore GetUserProfileOrganizationFromService completed at ' + dateNow + ' without errors');
  }
  private GetUserProfileOrganizationFromServiceFailed = (): void => {
    this.gettingUserProfile = false;
    let dateNow = new Date();
    console.log('UserProfileStore GetUserProfileOrganizationFromService failed at ' + dateNow + ' without errors');
  }
}
