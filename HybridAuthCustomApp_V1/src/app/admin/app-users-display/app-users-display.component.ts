import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { findIndex } from 'rxjs/operators';

import { Message } from 'primeng/components/common/api';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';

import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import { ApplicationApiService, AppUser, UserRole } from 'src/app/application-api.service';

import { UserProfile } from '../../user-profile/user-profile';
import { MsGraphService } from '../../user-profile/ms-graph.service';

import { forEach, find } from 'lodash';
import { filter } from 'lodash';
import { clone } from 'lodash';

@Component({
  selector: 'app-users-display',
  templateUrl: './app-users-display.component.html',
  styleUrls: ['./app-users-display.component.scss']//,
})
/** apps-users-display component*/
export class AppUsersDisplayComponent {
  // initialize variables
  public msgs: Message[];
  public appUsers: AppUser[];
  public appUserProfile: UserProfile;
  public userRoles: UserRole[];
  public waitingMessage: string;
  public filterOptions: SelectItem[];
  public selectedFilter: number;
  public cols: any[];

  // initialize fa
  public faTrashAlt = faTrashAlt;
  public faEdit = faEdit;

  // initialize flags
  public displayWaitingMessage: boolean;

  /** app-users-display ctor */
  constructor(
    private router: Router,
    private messageService: MessageService,
    private applicationApiService: ApplicationApiService,
    private msGraphService: MsGraphService,
    private confirmationService: ConfirmationService//,
  ) { }

  ngOnInit() {
    let dateNow = new Date();
    console.log('AppUsersDisplayComponent OnInit started at: ' + dateNow);

    // setup initial values for variables
    this.msgs = [];
    this.waitingMessage = 'Loading Users...';
    this.selectedFilter = 0;

    this.cols = [
      { field: 'employee.fullName', header: 'Name' },
      { field: 'userId', header: 'Network ID' },
      { field: 'roleName', header: 'Role' },
    ];

    // setup initial values for flags
    this.displayWaitingMessage = true;

    // get data
    this.GetAppUsers();
    this.GetUserRoles();

    dateNow = new Date();
    console.log('AppUsersDisplayComponent OnInit completed at: ' + dateNow);
  }

  private GetAppUsers = (): void => {
    let dateNow = new Date();
    console.log('GetAppUsers started at: ' + dateNow);

    this.applicationApiService.getAppUserAll()
      .subscribe((data: AppUser[]) => {
        this.appUsers = data;
        let dateNow = new Date();
        console.log('GetAppUsers completed at ' + dateNow + ' without errors');
        this.displayWaitingMessage = false;
      },
        error => {
          console.log('Error from method GetAppUsers: ' + error);
          this.messageService.add({ severity: 'error', summary: 'GetAppUsers failed', detail: 'Error from method GetAppUsers: ' + error });

          // cancel waiting message
          this.displayWaitingMessage = false;
        });
  }

  public OnAddNewClick = (): void => {
    // navigate to the app users detail page
    this.router.navigateByUrl('/admin/app-user');
  }

  public OnEditClick = (user: AppUser): void => {
    // navigate to the app users detail page
    this.router.navigateByUrl('/admin/app-user/' + user.id);
  }
  public OnDeleteClick = (user: AppUser): void => {
    console.log('method OnDeleteClick started');
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove App User \'' + user.networkId + '\'?',
      accept: () => {
        this.applicationApiService.deleteAppUser(user.id)
          .subscribe(res => {
            console.log('data from result of method DeleteAppUser:', res);
            if (res && res.id >= 0) {
              console.log('method DeleteAppUser succeeded');
              this.appUsers = this.appUsers.filter(u => u.id !== user.id);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'App User Removed Successfully' });
            }
          },
            error => {
              console.log('Error from method DeleteAppUser: ' + error);
              this.messageService.add({ severity: 'error', summary: 'Removed failed', detail: 'Error from method DeleteAppUser: ' + error });
            });
      },
      reject: () => {
        console.log('user rejected delete');
      }
    });
  }

  private GetUserRoles = (): void => {
    let dateNow = new Date();
    console.log('AppUsersDisplayComponent GetUserRoles started at: ' + dateNow);

    this.applicationApiService.getUserRoleAll()
      .subscribe((data: UserRole[]) => {
        this.userRoles = data;
        this.filterOptions = [
          { label: 'Show All', value: null }
        ];
        forEach(this.userRoles, role => {
          const roleName = role.roleName;
          const roleId = role.id;
          this.filterOptions.push(
            { label: roleName, value: roleId }
          )
        })
        let dateNow = new Date();
        console.log('GetUserRoles completed at ' + dateNow + ' without errors');
      },
        error => {
          console.log('Error from method GetUserRoles: ' + error);
          this.messageService.add({ severity: 'error', summary: 'GetUserRoles failed', detail: 'Error from method GetUserRoles: ' + error });
        });

    dateNow = new Date();
    console.log('AppUsersDisplayComponent GetUserRoles completed at: ' + dateNow);
  }
}
