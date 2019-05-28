import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserStoreService } from '../user/user-store.service';
import { AppUser } from '../application-api.service';

//import { SearchParametersService } from '../search/search-parameters.service';
//import { SearchParameters } from '../search/search-parameters';

import { WindowService } from '../root-shared/window.service'

@Component({
  selector: 'app-navigation',
  providers: [],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
/** navigation component*/
export class NavigationComponent implements OnInit {
  public searchString: string;
  public appUser: AppUser;

  // get viewchild reference for search toggle
  @ViewChild('searchPopupCloseLink') searchPopupCloseLink: ElementRef;

  /** navigation ctor */
  constructor(
    //private route: ActivatedRoute,
    private router: Router,
    public windowService: WindowService,
    private userStore: UserStoreService,
    //private searchParametersService: SearchParametersService//,
  ) { }

  ngOnInit() {
    let dateNow = new Date();
    console.log('NavigationComponent OnInit started at: ' + dateNow);

    // setup subscription for user observable
    this.userStore.appUserObservable$.subscribe(userValue => {
      if (userValue && userValue.userRoleId != 0) {
        this.appUser = userValue;
        dateNow = new Date();
        console.log('NavigationComponent appUser observable changed at: ' + dateNow);
      }
    })

    dateNow = new Date();
    console.log('NavigationComponent OnInit completed at: ' + dateNow);
  }

  public SearchPopupSearchIconClicked = (): void => {
    // put search string into array
    let searchTerms = this.searchString.split(' ');

    //// call service to set search parameters
    //let searchParameters = new SearchParameters();
    //searchParameters.simpleSearch = true;
    //searchParameters.hasRefiners = false;
    //searchParameters.simpleSearchTerms = searchTerms;
    //searchParameters.page = 1;
    //searchParameters.pageSize = 5;

    //this.searchParametersService.SetSearchParameters(searchParameters);

    // close search popup
    const el: HTMLElement = this.searchPopupCloseLink.nativeElement as HTMLElement;
    el.click();

    // route to serch results page
    this.router.navigate(['/searchresults']);
  }

  public SearchPopupInputKeyup = (searchPopupInputControlValue: string): void => {
    // set value of string
    this.searchString = searchPopupInputControlValue;
  }
}
