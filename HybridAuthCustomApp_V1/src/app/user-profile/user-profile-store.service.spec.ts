import { TestBed } from '@angular/core/testing';

import { UserProfileStoreService } from './user-profile-store.service';

describe('UserProfileStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserProfileStoreService = TestBed.get(UserProfileStoreService);
    expect(service).toBeTruthy();
  });
});
