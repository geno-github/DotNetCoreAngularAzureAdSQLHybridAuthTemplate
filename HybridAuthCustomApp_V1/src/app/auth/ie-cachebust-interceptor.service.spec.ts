import { TestBed } from '@angular/core/testing';

import { IeCachebustInterceptorService } from './ie-cachebust-interceptor.service';

describe('IeCachebustInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IeCachebustInterceptorService = TestBed.get(IeCachebustInterceptorService);
    expect(service).toBeTruthy();
  });
});
