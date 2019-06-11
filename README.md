# DotNetCoreAngularAzureAdSQLHybridAuthTemplate

## Purpose

Template to provide stable base for applications using Azure/SQL hybrid auth, C# .Net Core API and Angular Front-end.

## Target Audience

This template is designed for use by developers who are familiar with AzureAd, SQL, Angular and other technologies.  It assumes the end user developer is familiar with the security concepts commonly used for web applications and has access to Visual Studio.

## Disclaimer

This template is provided free of charge for the benefit of the community and, as such, there is no guarantee of suitability for any business or personal purpose.  All liabilities, including security risks of deploying internet facing web applications are assumed by the developer.  In addition, the developer using this template is entirely responsible for securing any data associated with applications developed using this template.

## Application Details

Once deployed as an application, this template allows users to login to front-end (Angular) application, obtain a token from AzureAd and redeem that token for access to the ASP.Net Core API layer.  After getting access to the API layer, the user token is passed to Microsoft Graph to obtain information about the user (including profile photo) and the organization.

The application allows admin users to manage which users can access the application and their level of access (Normal, Privileged, Admin).

The API layer of the template uses custom, layered policies, both granular at the method level and also at the controller level - to manage access to the methods that can supply data.  For example, normal users cannot add or remove other users through the API, but admin users can.

## Technology Stack

#### Applications created from this template use the following base technology stack:

1. ASP.Net Core v2.2
1. Entity Framework Core v2
1. Angular v7
1. SQL Server Data Transfer Project 

#### In addition to the base technology stack, the following backend tools are used in this template:

1. MSAL - Azure oAuth authentication
2. Swashbuckle/Swagger - documentation and service code automation
3. linqKit - efficient queries

#### In addition to the base technology stack, the following frontend tools are used in this template:

1. Bootstrap - responsive
   1. Popper
   1. jQuery
1. Font Awesome - icons
4. PrimeNg - grid, buttons and form controls

#### The development environment technology stack includes the following:

1. Visual Studio 2019 and/or Visual Studio Code (or other preferred IDE)
3. nSwag - service code automation

## Instructions for using the template to create a new application (Visual Studio)

#### Update gitIgnore

1. Create new local repo for new application
2. Add a gitIgnore combining the following:
   3. [Angular Tour of Heroes gitIgnore](https://github.com/johnpapa/angular-tour-of-heroes/blob/master/.gitignore) with the following additions from ASP.Net core web templa
   3. ASP.Net Core web application default gitIgnore
3. Push and sync updated gitIgnore

#### Setup application files from template

1. Obtain all files from the source template
2. Drop source template files in root of local repo
3. Rename files as necessary
4. Rename namespaces as necessary

#### Publish SQL Database from EF Project and Seed with Data

1. Right-click on database project
    1. Choose Publish
    2. Follow prompts to push database to DEV/TST server
    3. Use project name for database
       4. Example:  Toolbox
    4. In SQL Server Management Studio, login to DEV/TST SQL server and perform the following tasks:
    5. Verify that application database was created with the following 2 tables:
       * AppUser
       * UserRole
    6. Seed user roles in UserRole table:
       * 0	UnAuthorizedUser
       * 1  NormalUser
       * 2  PrivilegedUser
       * 3	AdminUser
    7. Seed users in AppUser table:
       * 0	System		1
       * 1	your email	3

#### Modify API Details

1. Make the following changes in Startup.cs
    1. Update c.SwaggerDoc object with information relevant to new Epic
    2. Update c.SwaggerEndpoint
    2. Update endpoint name
2. Edit project properties
    2. Update properties with information relevant to new application
2. Update database connection string in appsettings.json to match db name deployed in previous step
2. Create project configurations for Development, TST, Staging and Production
2. Setup API project as startup project

#### Modify Angular App Details

1. Make the following changes to package.json
     1. Update name property with name of application
          1. Example:  toolbox4
     1. Replace these 2 lines:
      * "startdev": "ng serve 'name of application' --ssl --ssl-key /node_modules/browser-sync/certs/server.key --ssl-cert /node_modules/browser-sync/certs/server.crt",
      * "startprod": "ng serve 'name of application' --prod --ssl --ssl-key /node_modules/browser-sync/certs/server.key --ssl-cert /node_modules/browser-sync/certs/server.crt",
1. Make the following changes to package.json
     1. Replace project name from template with name of application
1. Make the following changes to environment.ts
     1. Replace all instances of project name from template with name of application
1. Make the following changes to index.html
     1. Replace application title
     1. From the command line in the project root, run the following command:
          1. Npm install

## Setup AzureAd App Registrations
1. In [AzureAd Portal](https://portal.azure.com), browse to node:
     2. Application Registrations

### Add application registration for front-end UI

1. Click New Registration link and input the following values:
     1. Name:  Name of application + UI + environment
        1. Example:  “Toolbox - UI - DEV”
     1. Supported Account Types
        1. …this organization only (Turner Construction):
           1. Choose this for applications that are intended to accommodate only users who are in the Turner Active Directory
        1. …any organizational directory:
           1. Choose this for applications that are intended to accommodate users who are in the Turner Active Directory and other corporate Active Directory accounts
        1. …and personal accounts
           1. Choose this for applications that are intended to accommodate users who are in the Turner Active Directory and other corporate Active Directory accounts and Microsoft personal accounts
     1. Redirect URI
        1. https://localhost + SSL port number used by Angular application + /auth (see Angular cli properties)
            1. Example: 
            2. https://localhost:4200/auth 
     1. Click Register
1. From application registration screen:
   1. Click “Authentication” and set the following values:
      1. Logout URL:
      1. https://localhost:4200/logout
   1. Implicit grant
      1. Allow implicit grant flow for:
      1. Access Tokens
      1. ID Tokens
   1. Click Save
   1. Add owners (if necessary)

### Add application registration for API


1. Click New Registration link and input the following values:
   1. Name:  Name of application + API + environment
   1. Example:  “Application - API - DEV”
   1. Supported Account Types
      1. …this organization only (Turner Construction):
         1. Choose this for applications that are intended to accommodate only users who are in the Turner Active Directory
      1. …any organizational directory:
         1. Choose this for applications that are intended to accommodate users who are in the Turner Active Directory and other corporate Active Directory accounts
      1. …and personal accounts
         1. Choose this for applications that are intended to accommodate users who are in the Turner Active Directory and other corporate Active Directory accounts and Microsoft personal accounts
   1. Redirect URI
      5. https://localhost + SSL port number used by API application (see application properties >> debug)
      1. Example:
      2. https://localhost:44375
   1. Click Register
1. From application registration screen:
   1. Click “Expose an API” node
   1. Click “Add Scope”
   1. If prompted, chose “Save and Continue” on “Application ID URI” screen to accept default value
   1. On the “Add a Scope” screen, use the following values:
      1. Scope name:
      1. 'name of application'.AccessApi
   1. Who can consent?:
   1. Admins and users
      1. Admin consent display name:
         2. Admin consent to 'name of application' API
      1. Admin consent description:
         1. You are being asked to provide admin consent for 'name of application' API
      1. User consent display name:
         1. User consent to 'name of application' API
      1. User consent description:
         1. You are being asked to provide user consent for 'name of application' API
   1. State:
        1. Enabled
        1. Click Add Scope
   1. Verify that newly added scopes appear under “Scopes defined by this API”
1. Browse to “Expose an API”
   1. Click “Add a client application” and input the following values:
      1. Client ID: 'AzureAd front-end UI application GUID'
   1. Authorized scopes:
      1. Put a check by permission scope created in previous step
   1. Click “Add application”
1. Verify that scope shows up under “Authorized client applications”

## Update AzureAd Application Values in API

Update the application registration values in the appsettings.*.json files in the API (use values from the app registration completed in previous step and examples in the files).

## Update AzureAd Application Values in Angular app

Update the application registration values in the environment.*.ts files in the Angular application (use values from the app registration completed in previous step and examples in the files).

## Update Angular service references from nSwag Studio

1. Start nSwag Studio application
   2. Open .nswag file in application
2. Start new appliation in IDE with F5
2. Click swagger.json link from Swagger screen
3. Paste swagger.json data into nSwag screen
5. Save .nswag file
6. Click Generate Files to regenerate the Angular service files

## Start Angular Application

1. Open command line in root of ASP.Net Core web application
2. Run the following command:
   3. npm run startdev

This should start a webserver with the Angular appliation running.  Browse to the address indicated on the screen to test and validate token flow.

#### Please report any problems using this template to [geno-github@users.noreply.github.com](mailto:geno-github@users.noreply.github.com)
