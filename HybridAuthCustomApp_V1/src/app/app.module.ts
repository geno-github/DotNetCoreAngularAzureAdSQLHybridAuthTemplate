import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { MsalModule } from '../vendor-modified-dist/msal-angular/msal.module';
import { MsalService, MSAL_CONFIG } from '../vendor-modified-dist/msal-angular/msal.service';
import { LogLevel } from 'msal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { environment } from 'src/environments/environment';
import { UserComponent } from './user/user.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { API_BASE_URL } from './application-api.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { IeCachebustInterceptorService } from './auth/ie-cachebust-interceptor.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AppSharedModule } from './app-shared/app-shared.module';

import { SharedModule, ConfirmDialogModule, ConfirmationService, DropdownModule, AccordionModule, AutoCompleteModule, ButtonModule, CalendarModule, CheckboxModule, DialogModule, EditorModule, FieldsetModule, FileUploadModule, GrowlModule, InputTextareaModule, ListboxModule, PaginatorModule, PanelModule, InputTextModule, ProgressBarModule, RadioButtonModule, RatingModule, SelectButtonModule, SplitButtonModule, TabViewModule, TreeModule, TreeTableModule, MessageService } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

export function loggerCallback(logLevel, message, piiEnabled) {
  console.log('msal client logging: ' + message);
}
const apiAccessString = `${environment.msalConfig.apiAppIdUri}`;
const apiApiRootString = `${environment.apiRoot}`;
export const protectedResourceMap: [string, string[]][] = [[apiApiRootString, [apiAccessString]], ['https://graph.microsoft.com/v1.0/me', ['user.read']], ['https://graph.microsoft.com/beta/me', ['user.read']], ['https://graph.microsoft.com/beta/me/photo/$value', ['user.read']], ['https://graph.microsoft.com/v1.0/me/photo/$value', ['user.read']], ['https://graph.microsoft.com/v1.0/users', ['user.read']], ['https://graph.microsoft.com/v1.0/organization', ['directory.read.all']]];

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    AuthComponent,
    LoginComponent,
    LogoutComponent,
    UserComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AppSharedModule,
    MsalModule,
    ToastModule
  ],
  providers: [
    MsalService,  // This is a provider explicitly now
    {
      provide: MSAL_CONFIG,  // MsalService needs config, this provides it.
      useFactory: () => ({   // Note this is an arrow fn that returns the config object
        clientID: environment.msalConfig.clientID,
        authority: environment.msalConfig.authority,
        validateAuthority: environment.msalConfig.validateAuthority,
        redirectUri: environment.msalConfig.redirectUri,
        cacheLocation: environment.msalConfig.cacheLocation,
        postLogoutRedirectUri: environment.msalConfig.postLogoutRedirectUri,
        navigateToLoginRequestUrl: environment.msalConfig.navigateToLoginRequestUrl,
        popUp: environment.msalConfig.popUp,
        consentScopes: environment.msalConfig.consentScopes,
        unprotectedResources: environment.msalConfig.unprotectedResources,
        protectedResourceMap: protectedResourceMap,
        logger: loggerCallback,
        correlationId: environment.msalConfig.correlationId,
        level: environment.msalConfig.level,
        piiLoggingEnabled: environment.msalConfig.piiLoggingEnabled,
      }),
    },
    {
      provide: API_BASE_URL,
      useValue: environment.apiRoot
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: IeCachebustInterceptorService,
      multi: true
    },
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
