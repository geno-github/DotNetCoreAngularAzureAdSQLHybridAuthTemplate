import { TestBed } from '@angular/core/testing';

import { AuthPrivilegedUserGuardService } from './auth-privileged-user-guard.service';

describe('AuthPrivilegedUserGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthPrivilegedUserGuardService = TestBed.get(AuthPrivilegedUserGuardService);
    expect(service).toBeTruthy();
  });
});
