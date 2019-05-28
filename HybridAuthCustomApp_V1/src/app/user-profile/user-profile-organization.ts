export class UserProfileOrganization {
  'assignedPlans': [{ '@odata.type': 'microsoft.graph.assignedPlan' }];
  'businessPhones': [string];
  'city': string;
  'country': string;
  'countryLetterCode': string;
  'createdDateTime': 'String (timestamp)';
  'deletedDateTime': 'String (timestamp)';
  'displayName': 'string';
  'id': 'string (identifier)';
  'isMultipleDataLocationsForServicesEnabled': 'boolean';
  'marketingNotificationEmails': [string];
  'onPremisesLastSyncDateTime': 'String (timestamp)';
  'onPremisesSyncEnabled': boolean;
  'postalCode': string;
  'preferredLanguage': string;
  'privacyProfile': { '@odata.type': 'microsoft.graph.privacyProfile' };
  'provisionedPlans': [{ '@odata.type': 'microsoft.graph.provisionedPlan' }];
  'securityComplianceNotificationMails': [string];
  'securityComplianceNotificationPhones': [string];
  'state': string;
  'street': string;
  'technicalNotificationMails': [string];
  'verifiedDomains': [{ '@odata.type': 'microsoft.graph.verifiedDomain' }]
}