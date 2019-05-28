import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse, HttpSentEvent, HttpEvent, HttpProgressEvent } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { UserProfile } from './user-profile';
import { UserProfileOrganization } from './user-profile-organization';
import { UserProfileOrganizations } from './user-profile-organizations';

@Injectable({
  providedIn: 'root'
})
export class MsGraphService {
  // initilialize variables
  private apiActionUrl: string;
  private apiActionUrlBeta: string;

  public apiHeaders: HttpHeaders;
  private httpOptions: any;
  private userProfile: UserProfile;
  private imagePathInCloud: string;

  constructor(
    private http: HttpClient
  ) {
    // initialize variable values
    this.apiActionUrl = 'https://graph.microsoft.com/v1.0/';
    this.apiActionUrlBeta = 'https://graph.microsoft.com/beta/';

    this.apiHeaders = new HttpHeaders();
    this.apiHeaders.append('Accept', 'application/json');
  }

  public GetUserProfile = (): Observable<UserProfile> => {
    let dateNow = new Date();
    console.log('GetUserProfile started at: ' + dateNow);


    this.httpOptions = {
      headers: this.apiHeaders,
      responseType: 'json',
      observe: 'response'
    };

    const targetUrl = this.apiActionUrl + 'me';

    return this.http.get<UserProfile>(targetUrl).pipe(
      tap(data => console.log('data from result of method GetUserProfile:', data)),
      catchError(this.handleError<UserProfile>('GetUserProfile', null))
    );

    dateNow = new Date();
    console.log('GetUserProfile completed at: ' + dateNow);
  }

  public GetAnotherUsersProfile = (userPrincipalName: string): Observable<UserProfile> => {
    let dateNow = new Date();
    console.log('GetAnotherUsersProfile started at: ' + dateNow);


    this.httpOptions = {
      headers: this.apiHeaders,
      responseType: 'json',
      observe: 'response'
    };

    const targetUrl = this.apiActionUrl + 'users/' + userPrincipalName;

    return this.http.get<UserProfile>(targetUrl).pipe(
      tap(data => console.log('data from result of method GetAnotherUsersProfile:', data)),
      catchError(this.handleError<UserProfile>('GetAnotherUsersProfile', null))
    );

    dateNow = new Date();
    console.log('GetAnotherUsersProfile completed at: ' + dateNow);
  }

  public CheckUserProfilePhoto = (): Observable<boolean> => {
    let dateNow = new Date();
    console.log('CheckUserProfilePhoto started at: ' + dateNow);

    this.httpOptions = {
      headers: this.apiHeaders,
      responseType: 'json',
      observe: 'response'
    };

    const targetUrl = this.apiActionUrl + 'me/photo';

    return this.http.get(targetUrl, { responseType: 'json' })
      .pipe(
        map(
          res => {
            console.log('data from result of method CheckUserProfilePhoto:', res);
            if (res && res.hasOwnProperty('id')) {
              return true;
            } else {
              return false;
            }
          }),
        catchError(error => {
          return of(false)
        })
      );
  }

  public GetUserProfilePhoto = (): Observable<Blob> => {
    let dateNow = new Date();
    console.log('GetUserProfilePhoto started at: ' + dateNow);

    this.httpOptions = {
      headers: this.apiHeaders,
      responseType: 'arraybuffer',
      observe: 'response'
    };

    const targetUrl = this.apiActionUrl + 'me/photo/$value';

    return this.http.get(targetUrl, { responseType: 'blob' }).pipe(
      tap(data => console.log('data from result of method GetUserProfilePhoto:', data)),
      catchError(this.handleError<Blob>('GetUserProfilePhoto', null))
    );
  }

  public GetUserProfilePhotoBeta = (): Observable<Blob> => {
    let dateNow = new Date();
    console.log('GetUserProfilePhotoBeta started at: ' + dateNow);

    this.httpOptions = {
      headers: this.apiHeaders,
      responseType: 'arraybuffer',
      observe: 'response'
    };

    const targetUrl = this.apiActionUrlBeta + 'me/photo/$value';

    return this.http.get(targetUrl, { responseType: 'blob' }).pipe(
      tap(data => console.log('data from result of method GetUserProfilePhoto:', data)),
      catchError(this.handleError<Blob>('GetUserProfilePhoto', null))
    );
  }

  public GetUserProfileOrganizations = (): Observable<UserProfileOrganizations> => {
    let dateNow = new Date();
    console.log('GetUserProfileOrganization started at: ' + dateNow);


    this.httpOptions = {
      headers: this.apiHeaders,
      responseType: 'json',
      observe: 'response'
    };

    const targetUrl = this.apiActionUrl + 'organization';

    return this.http.get<UserProfileOrganizations>(targetUrl).pipe(
      tap(data => console.log('data from result of method GetUserProfileOrganization:', data.value[0])
      ));

    dateNow = new Date();
    console.log('GetUserProfileOrganization completed at: ' + dateNow);
  }

  public GetCompanyName = (): Observable<string> => {
    let dateNow = new Date();
    console.log('GetCompanyName started at: ' + dateNow);

    this.httpOptions = {
      headers: this.apiHeaders,
      responseType: 'json',
      observe: 'response'
    };

    const targetUrl = this.apiActionUrl + 'me?$select=companyName';

    return this.http.get<UserProfile>(targetUrl).pipe(
      tap(data => console.log('data from result of method GetCompanyName:', data)),
      map(response => {
        if (response && response.companyName) {
          return response.companyName;
        }
      }),
      catchError(this.handleError<string>('GetCompanyName', null))
    );

    dateNow = new Date();
    console.log('GetCompanyName completed at: ' + dateNow);
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
