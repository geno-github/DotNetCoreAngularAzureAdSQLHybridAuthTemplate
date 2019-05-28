import { LogLevel } from 'msal';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiRoot: '<url of api with port number example: https://localhost:44375 or blank for tst, prod>',
  // dev1
  msalConfig: {
    clientID: '<guid of front-end application registration in AzureAd example: abcdefgh-ijkl-mnop-qrst-uvwxyx123456>',
    apiClientID: '<guid of API application registration in AzureAd example: abcdefgh-ijkl-mnop-qrst-uvwxyx123456>',
    apiAppIdUri: '<permission scope for API from app registration in AzureAd example: api://abcdefgh-ijkl-mnop-qrst-uvwxyx123456/Application.AccessAPI >',
    authority: 'https://login.microsoftonline.com/common/',
    // adminConsentLink - replace clientid and URL below
    adminConsentLink: 'https://login.microsoftonline.com/common/oauth2/authorize?client_id=fdd4bd14-6b34-4ad6-a951-32b0409e56c2&response_type=code&redirect_uri=https://localhost:4200/auth&nonce=1234&resource=https://graph.windows.net&prompt=admin_consent',
    validateAuthority: true,
    redirectUri: '<url of auth page with port number example: https://localhost:4200/auth or https://<fqdn>/auth for tst, prod>',
    cacheLocation: 'localStorage',
    postLogoutRedirectUri: '<url of logout page with port number example: https://localhost:4200/logout or https://<fqdn>/logout for tst, prod>',
    navigateToLoginRequestUrl: false,
    popUp: false,
    consentScopes: [
      '<permission scope for API from app registration in AzureAd example: api://abcdefgh-ijkl-mnop-qrst-uvwxyx123456/Application.AccessAPI >',
    ],
    unprotectedResources: ["https://www.microsoft.com/en-us/"],
    correlationId: '3871',
    level: LogLevel.Verbose,
    piiLoggingEnabled: true
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
