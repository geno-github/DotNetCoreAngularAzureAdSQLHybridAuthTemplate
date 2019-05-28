import { TestBed } from '@angular/core/testing';

import { AuthNormalUserGuardService } from './auth-normal-user-guard.service';

describe('AuthNormalUserGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthNormalUserGuardService = TestBed.get(AuthNormalUserGuardService);
    expect(service).toBeTruthy();
  });
});
