import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse }
  from '@angular/common/http';

import { AuthMsalError } from './auth-msal-error';

import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs';
import 'rxjs/add/operator/do';
import { mergeMap } from 'rxjs/operators';
import { BroadcastService } from '../../vendor-modified-dist/msal-angular/broadcast.service';
import { MsalService } from '../../vendor-modified-dist/msal-angular/msal.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private auth: MsalService,
    private broadcastService: BroadcastService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let dateNow = new Date();
    console.log('AuthInterceptor intercept started at: ' + dateNow);
    var scopes = [];
    if (req.url.startsWith(`${environment.apiRoot}`) || req.url.startsWith('/api/')) {
      scopes = [
        `${environment.msalConfig.apiAppIdUri}`
      ];
    }
    else {
      scopes = this.auth.getScopesForEndpoint(req.url);
    }
    this.auth.verbose('Url: ' + req.url + ' maps to scopes: ' + scopes);
    if (scopes === null) {
      return next.handle(req);
    }
    var tokenStored = this.auth.getCachedTokenInternal(scopes);
    if (tokenStored && tokenStored.token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${tokenStored.token}`,
        }
      });
      return next.handle(req).do(event => { }, err => {
        if (err instanceof HttpErrorResponse && err.status == 401) {
          var scopes = this.auth.getScopesForEndpoint(req.url);
          var tokenStored = this.auth.getCachedTokenInternal(scopes);
          if (tokenStored && tokenStored.token) {
            this.auth.clearCacheForScope(tokenStored.token);
          }
          var msalError = new AuthMsalError(JSON.stringify(err), "", JSON.stringify(scopes));
          this.broadcastService.broadcast('msal:notAuthorized', msalError);
        }
      });
    }
    else {
      return from(this.auth.acquireTokenSilent(scopes).then(token => {
        const JWT = `Bearer ${token}`;
        return req.clone({
          setHeaders: {
            Authorization: JWT,
          },
        });
      })).pipe(mergeMap(req => next.handle(req).do(event => { }, err => {
        if (err instanceof HttpErrorResponse && err.status == 401) {
          var scopes = this.auth.getScopesForEndpoint(req.url);
          var tokenStored = this.auth.getCachedTokenInternal(scopes);
          if (tokenStored && tokenStored.token) {
            this.auth.clearCacheForScope(tokenStored.token);
          }
          var msalError = new AuthMsalError(JSON.stringify(err), "", JSON.stringify(scopes));
          this.broadcastService.broadcast('msal:notAuthorized', msalError);
        }
      }))); //calling next.handle means we are passing control to next interceptor in chain
    }
    dateNow = new Date();
    console.log('AuthInterceptor intercept completed at: ' + dateNow);

    //intercept(
    //    req: HttpRequest<any>,
    //    next: HttpHandler
    //): Observable<HttpEvent<any>> {

    //    return next.handle(req).do(evt => {
    //        if (evt instanceof HttpResponse) {
    //            console.log('---> status:', evt.status);
    //            console.log('---> filter:', req.params.get('filter'));
    //        }
    //    });

    //}
  }

}
