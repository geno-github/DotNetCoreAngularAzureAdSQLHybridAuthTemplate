import { Injectable } from '@angular/core';

import { ApplicationApiService, AppUser } from '../application-api.service';
import { Subject, ReplaySubject, BehaviorSubject } from 'rxjs';

import { MsalService } from '../../vendor-modified-dist/msal-angular/msal.service';
import { UserProfileStoreService } from '../user-profile/user-profile-store.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private appUser: AppUser;
  private _hybridAuthFailed: boolean = false;
  private _appUserObservable$: BehaviorSubject<AppUser>;

  public gettingUser = false;

  constructor(
    private applicationApiService: ApplicationApiService,
    private msalService: MsalService,
    private authService: AuthService,
    private userProfileStoreService: UserProfileStoreService
  ) {
    // set observable to null initially
    this._appUserObservable$ = new BehaviorSubject(null);
  }

  // allows components to subscribe to the observable
  public get appUserObservable$() {
    return this._appUserObservable$.asObservable();
  }

  public get hybridAuthFailed(): boolean {
    if (this._hybridAuthFailed) {
      return true;
    } else {
      return false;
    }
  }

  public get isHybridAuthenticated(): boolean {
    if (this.appUser && this.appUser.id) {
      return true;
    } else {
      return false;
    }
  }

  // allows components to reset the observable
  public ResetAppUser = (): void => {
    let dateNow = new Date();
    console.log('UserStore ResetAppUser called at: ' + dateNow);

    this._appUserObservable$.next(this.appUser);

    dateNow = new Date();
    console.log('UserStore ResetAppUser completed at: ' + dateNow);
  }

  // method to get user from service and put it in the store
  public InitializeUser = () => {
    let dateNow = new Date();
    console.log('UserStore InitializeUser called at: ' + dateNow);
    if (!this.gettingUser && !this.appUser) {
      this.gettingUser = true;
      this.GetUserFromService();
    }
  }

  // method to obtain user identity from service
  private GetUserFromService = () => {
    let dateNow = new Date();
    console.log('UserStore GetUserFromService called at ' + dateNow);

    const idToken: any = this.msalService._oauthData ? this.msalService._oauthData.idToken : null;

    if (idToken && idToken.preferred_username) {
      this.applicationApiService.getAppUserByNetworkId(idToken.preferred_username)
        .subscribe(data => {
          this.appUser = data;
          this.GetUserFromServiceSuccess();
        }
          , error => this.GetUserFromServiceFailed()
        );
    } else {
      console.log('UserStore GetUserFromService: No login token at ' + dateNow);
      this.authService.login();
    }
  }
  private GetUserFromServiceSuccess = (): void => {
    this.gettingUser = false;
    this._hybridAuthFailed = false;

    // set observable
    this._appUserObservable$.next(this.appUser);

    // initialize user profile
    this.userProfileStoreService.InitializeUserProfile();

    let dateNow = new Date();
    console.log('UserStore GetUserFromService completed at ' + dateNow + ' without errors');
  }
  private GetUserFromServiceFailed = (): void => {
    this.gettingUser = false;
    this._hybridAuthFailed = true;

    // "bump" appUser object
    this._appUserObservable$.next(this.appUser);

    let dateNow = new Date();
    console.log('UserStore GetUserFromService failed at ' + dateNow);
  }

  // method to provide user object to consumers of the store
  public GetUser = (): Promise<AppUser> => {
    let dateNow = new Date();
    console.log('UserStore GetUser called at ' + dateNow);
    return Promise.resolve(this.appUser);
  }

  // method to provide user name to consumers of the store
  public GetUserName = (): Promise<string> => {
    let dateNow = new Date();
    console.log('UserStore GetUserName called at ' + dateNow);
    return Promise.resolve(this.appUser.networkId);
  }

  public get GetUserRoleName(): string {
    if (this.appUser) {
      return this.appUser.userRole.roleName;
    } else {
      return null;
    }
  }

  public set SetCompanyName(companyName: string) {
    if (companyName) {
      this.appUser.companyName = companyName;
      this.applicationApiService.putAppUser(this.appUser.id, this.appUser);
    }
  }

  public set SetDisplayName(displayName: string) {
    if (displayName) {
      this.appUser.displayName = displayName;
      this.applicationApiService.putAppUser(this.appUser.id, this.appUser)
        .subscribe(res => console.log('result from SetDisplayName: ', res));
    }
  }

  public set SilentUpdateAppUser(appUser: AppUser) {
    if (appUser) {
      this.appUser = appUser;
      this.applicationApiService.postSelfUpdate(this.appUser)
      .subscribe(res => console.log('result from SilentUpdateAppUser: ', res));
    }
  }

  //private WaitForLogin = (): void => {
  //  if (!(this.gettingUser && this.authService.isAuthenticated && this.authService.authHardFailed && this.authService.authSoftFailed)) {
  //    setTimeout(() => {
  //      if (this.getUserLoopCount <= 50) {
  //        this.getUserLoopCount++;
  //        this.GetUserFromService();
  //      }
  //      else {
  //        let dateNow = new Date();
  //        console.log('WaitForLogin timed out at ' + dateNow);
  //      }
  //    }, 200);
  //  }
  //}

  // boilerplate store code
  //create(todo: Todo) {
  //    this.http.post(`${this.baseUrl}/todos`, JSON.stringify(todo))
  //        .map(response => response.json()).subscribe(data => {
  //            this.dataStore.todos.push(data);
  //            this._todos.next(Object.assign({}, this.dataStore).todos);
  //        }, error => console.log('Could not create todo.'));
  //}

  //update(todo: Todo) {
  //    this.http.put(`${this.baseUrl}/todos/${todo.id}`, JSON.stringify(todo))
  //        .map(response => response.json()).subscribe(data => {
  //            this.dataStore.todos.forEach((t, i) => {
  //                if (t.id === data.id) { this.dataStore.todos[i] = data; }
  //            });

  //            this._todos.next(Object.assign({}, this.dataStore).todos);
  //        }, error => console.log('Could not update todo.'));
  //}

  //remove(todoId: number) {
  //    this.http.delete(`${this.baseUrl}/todos/${todoId}`).subscribe(response => {
  //        this.dataStore.todos.forEach((t, i) => {
  //            if (t.id === todoId) { this.dataStore.todos.splice(i, 1); }
  //        });

  //        this._todos.next(Object.assign({}, this.dataStore).todos);
  //    }, error => console.log('Could not delete todo.'));
  //}
}

