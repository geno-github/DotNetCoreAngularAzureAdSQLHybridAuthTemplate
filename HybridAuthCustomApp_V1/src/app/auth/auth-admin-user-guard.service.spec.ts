import { TestBed } from '@angular/core/testing';

import { AuthAdminUserGuardService } from './auth-admin-user-guard.service';

describe('AuthAdminUserGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthAdminUserGuardService = TestBed.get(AuthAdminUserGuardService);
    expect(service).toBeTruthy();
  });
});
