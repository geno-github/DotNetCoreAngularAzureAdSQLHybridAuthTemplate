import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { BroadcastService } from '../../vendor-modified-dist/msal-angular/broadcast.service';
import { MsalService } from '../../vendor-modified-dist/msal-angular/msal.service';
import { from, of } from 'rxjs';
import { tap, mergeMap, switchMap, catchError } from 'rxjs/operators'
import { Observable } from 'rxjs/Observable';

// TODO: Remove when MSAL library supports Angular 6, and use MsalInterceptor instead

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private auth: MsalService, private broadcastService: BroadcastService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const scopes = this.auth.getScopesForEndpoint(req.url);
    this.auth.verbose('Url: ' + req.url + ' maps to scopes: ' + scopes);
    if (scopes === null) {
      return next.handle(req);
    }
    const tokenStored = this.auth.getCachedTokenInternal(scopes);
    if (tokenStored && tokenStored.token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${tokenStored.token}`,
        }
      });
      return next.handle(req).do(event => { }, err => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          const scopesl = this.auth.getScopesForEndpoint(req.url);
          const tokenStoredl = this.auth.getCachedTokenInternal(scopesl);
          if (tokenStoredl && tokenStoredl.token) {
            this.auth.clearCacheForScope(tokenStoredl.token);
          }
          this.broadcastService.broadcast('msal:notAuthorized', { err, scopesl });
        }
      });
    } else {
      return from(this.auth.acquireTokenSilent(scopes, environment.msalConfig.authority))
        .pipe(
          switchMap(token => {
            const headers = req.headers
              .set('Authorization', 'Bearer ' + token)
            const requestClone = req.clone({
                headers
              });
            return next.handle(requestClone).do(
              event => {
                console.log('next.handle event:', event);
              },
              err => {
                if (err instanceof HttpErrorResponse && err.status === 401) {
                  const scopesl = this.auth.getScopesForEndpoint(req.url);
                  const tokenStoredl = this.auth.getCachedTokenInternal(scopesl);
                  if (tokenStoredl && tokenStoredl.token) {
                    this.auth.clearCacheForScope(tokenStoredl.token);
                  }
                  this.broadcastService.broadcast('msal:notAuthorized', { err, scopesl });
                }
              });
          })
        );
    }
  }
}