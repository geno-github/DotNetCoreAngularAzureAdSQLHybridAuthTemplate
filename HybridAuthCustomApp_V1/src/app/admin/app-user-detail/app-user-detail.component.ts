import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

import { ApplicationApiService, AppUser, UserRole } from 'src/app/application-api.service';

import { Observable } from 'rxjs';

import { clone } from 'lodash';
import { filter } from 'lodash';
import { UserProfile } from '../../user-profile/user-profile';
import { MsGraphService } from '../../user-profile/ms-graph.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-app-user-detail',
  templateUrl: './app-user-detail.component.html',
  styleUrls: ['./app-user-detail.component.scss']
})
export class AppUserDetailComponent implements OnInit {
  // initialize variables
  public appUserData: AppUser;
  public userProfile: UserProfile;
  public appUsersAutocomplete: AppUser[];
  public userId: number;
  public appUserForm: FormGroup;
  public userRoleChoices: UserRole[];
  public waitingMessage: string;

  // initialize flags
  public displayWaitingMessage: boolean;

  /** app-user-detail ctor */
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private applicationApiService: ApplicationApiService,
    private msGraphService: MsGraphService
  ) { }

  ngOnInit() {
    let dateNow = new Date();
    console.log('AppUserDetailComponent OnInit started at: ' + dateNow);

    // initialize variable values
    this.userId = -1;

    // initialize flag values

    // get data for dropdowns
    this.GetUserRoles();

    // new user or existing user?
    if (this.route.snapshot.paramMap.has('userId')) { // page called with id, load data from service
      // set messages and flags
      this.waitingMessage = 'Loading App User...';
      this.displayWaitingMessage = true;

      // get the user from DB
      this.userId = parseInt(this.route.snapshot.paramMap.get('userId'), 10);
      if (this.userId >= 0) {
        this.applicationApiService.getAppUser(this.userId)
          .subscribe(
            (data: AppUser) => {
              this.appUserData = data;
              this.GetAppUserSuccess();
            },
            error => {
              console.log('Error getting user from service: ', error);
              this.GetAppUserFailed(error);
            });
      } else {
        this.GetAppUserFailed('UserID is not valid');
      }
    } else {  // page called without id, adding new
      // set initial values for appUserData object
      this.appUserData = new AppUser();
      this.appUserData.id = 0;
      this.appUserData.networkId = '';

      // create form
      this.appUserForm = this.CreateFormGroup(this.appUserData);
    }

    dateNow = new Date();
    console.log('AppUserDetailComponent OnInit completed at: ' + dateNow);
  }

  private GetAppUserSuccess = (): void => {
    let dateNow = new Date();
    console.log('GetAppUserSuccess completed at ' + dateNow + ' without errors');
    console.log('AppUser from service: ', this.appUserData);

    // create form
    this.appUserForm = this.CreateFormGroup(this.appUserData);

    // disable email control
    this.appUserForm.controls['networkId'].disable();

    // populate form from data
    this.PopulateFormFromData();

    // cancel waiting message
    this.displayWaitingMessage = false;

    // get the user's profile
    this.GetAppUserProfile(this.appUserData.networkId);
  }
  private GetAppUserFailed = (errorMsg: string): void => {
    let dateNow = new Date();
    console.log('GetAppUserFailed started at ' + dateNow);

    this.messageService.add({ severity: 'error', summary: 'Error Getting User from API', detail: 'Error Getting User from API: ' + errorMsg });

    // cancel waiting message
    this.displayWaitingMessage = false;

    dateNow = new Date();
    console.log('GetAppUserFailed completed at ' + dateNow);

    // cancel waiting message
    this.displayWaitingMessage = false;
  }

  private GetAppUserProfile = (userPrincipalName: string): void => {
    let dateNow = new Date();
    console.log('GetAppUserProfile started at ' + dateNow);

    this.msGraphService.GetAnotherUsersProfile(userPrincipalName)
      .subscribe(
        (data: UserProfile) => {
          if (data) {
            this.userProfile = data;
          }
        }
      )
  }

  private CreateFormGroup = (data: AppUser): FormGroup => {
    let dateNow = new Date();
    console.log('CreateFormGroup started at: ' + dateNow);

    // create reactive form group
    let userRole = null;
    if (data.userRoleId != null)
      userRole = filter(this.userRoleChoices, ['id', data.userRoleId])[0];
    const formGroup = this.fb.group({
      id: [data.id],
      networkId: [data.networkId, [Validators.required, Validators.email]],
      companyName: [data.companyName],
      displayName: [data.displayName],
      userRoleId: [data.userRoleId],
      userRole: [userRole, Validators.required],
      isActive: [data.isActive],
      createdBy: [data.createdBy],
      createdOn: [data.createdOn],
      lastModifiedBy: [data.lastModifiedBy],
      lastModifiedDate: [data.lastModifiedDate],
    });

    dateNow = new Date();
    console.log('CreateFormGroup completed at: ' + dateNow);

    // return formgroup
    return formGroup;
  }

  private PopulateDataFromForm = (): void => {
    let dateNow = new Date();
    console.log('PopulateDataFromForm started at: ' + dateNow);

    // declare a variable to hold a snapshot of the form values
    const formModel = this.appUserForm.value;

    // merge deep copy, form values, image guids and original data (id)
    let appUserToSaveObject = new AppUser();

    appUserToSaveObject.id = formModel.id as number;
    appUserToSaveObject.networkId = formModel.networkId as string;
    appUserToSaveObject.companyName = formModel.companyName as string;
    appUserToSaveObject.displayName = formModel.displayName  as string;
    appUserToSaveObject.userRoleId = formModel.userRole.id as number;
    appUserToSaveObject.isActive = formModel.isActive as boolean;
    appUserToSaveObject.createdBy = formModel.createdBy ? formModel.createdBy as number : 0;
    appUserToSaveObject.createdOn = formModel.createdOn ? formModel.createdOn as Date : new Date();
    appUserToSaveObject.lastModifiedBy = 0;
    appUserToSaveObject.lastModifiedDate = new Date();

    const appUserToSave: AppUser = appUserToSaveObject;

    // save updated values in data object
    this.appUserData = appUserToSave;

    dateNow = new Date();
    console.log('PopulateDataFromForm completed at: ' + dateNow);
  }
  
  private PopulateFormFromData = (): void => {
    let dateNow = new Date();
    console.log('PopulateFormFromData started at: ' + dateNow);

    // clone the hardware type data object
    let appUserDataClone = clone(this.appUserData);
    this.appUserForm.patchValue(appUserDataClone);

    dateNow = new Date();
    console.log('PopulateFormFromData completed at: ' + dateNow);
  }

  private OnSubmitButtonClick = (): void => {
    let dateNow = new Date();
    console.log('OnSubmitButtonClick started at: ' + dateNow);

    this.waitingMessage = 'Saving App User';
    this.displayWaitingMessage = true;
    this.appUserForm.disable();

    try {
      // prepare data for saving
      this.PopulateDataFromForm();

      //test for new
      if (this.userId < 0) {
        // create new admin user
        this.CreateNewAppUser();
      }
      else { // update admin user
        this.UpdateExistingAppUser();
      }
    } catch (e) {
      console.log('Error saving admin user:' + e);
      this.messageService.add({ severity: 'error', summary: 'Save failed', detail: 'Error saving admin user: ' + e });
    }

    dateNow = new Date();
    console.log('OnSubmitButtonClick completed at: ' + dateNow);
  }

  private CreateNewAppUser = (): void => {
    let dateNow = new Date();
    console.log('CreateNewAppUser started at: ' + dateNow);

    // call service add method
    let serviceResponse = this.applicationApiService.postAppUser(this.appUserData)
      .subscribe(
        res => {
          console.log('data from result of method CreateNewAppUser:', res);
          if (res && res.id >= 0) { // successfully added user
            console.log('method CreateNewAppUser succeeded');

            // put results from save into app user object
            this.appUserData = res;

            // show success message
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'App User Created Successfully' });

            // run success method
            this.SaveAppUserSucceeded();
          }
        },
        error => {
          console.log('Error from method CreateNewAppUser: ' + error);
          this.messageService.add({ severity: 'error', summary: 'Save failed', detail: 'Error from method CreateNewAppUser: ' + error });
        });

    dateNow = new Date();
    console.log('CreateNewAppUser completed at: ' + dateNow);
  }

  private UpdateExistingAppUser = (): void => {
    let dateNow = new Date();
    console.log('UpdateExistingAppUser started at: ' + dateNow);

    // call service update method
    this.applicationApiService.putAppUser(this.appUserData.id, this.appUserData)
      .subscribe(
        res => {
          console.log('data from result of method UpdateExistingAppUser:', res);
          console.log('method UpdateExistingAppUser succeeded');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'App User Updated Successfully' });
          this.SaveAppUserSucceeded();
        },
        error => {
          console.log('Error from method UpdateExistingAppUser: ' + error);
          this.messageService.add({ severity: 'error', summary: 'Save failed', detail: 'Error from method UpdateExistingAppUser: ' + error });
        });

    dateNow = new Date();
    console.log('UpdateExistingAppUser completed at: ' + dateNow);
  }

  private SaveAppUserSucceeded = (): void => {
    let dateNow = new Date();
    console.log('SaveAppUserSucceeded started at: ' + dateNow);

    // set flags
    this.displayWaitingMessage = false;

    // route back to home
    this.router.navigate(['./admin/app-users']);

    dateNow = new Date();
    console.log('SaveAppUserSucceeded completed at: ' + dateNow);
  }

  private GetUserRoles = (): void => {
    let dateNow = new Date();
    console.log('GetUserRoles started at: ' + dateNow);

    this.applicationApiService.getUserRoleAll()
      .subscribe((data: UserRole[]) => {
        console.log('UserRoles from service: ', this.userRoleChoices);
        this.userRoleChoices = data
      },
        error => console.log(error));
  }

  public OnCancelButtonClick = (): void => {
    this.router.navigate(['./admin/app-users']);
  }

  public get networkIdField() {
    return this.appUserForm.get('networkId');
  }
  public get userRoleField() {
    return this.appUserForm.get('userRole');
  }
}
