import { TestBed } from '@angular/core/testing';

import { MsGraphService } from './ms-graph.service';

describe('MsGraphService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MsGraphService = TestBed.get(MsGraphService);
    expect(service).toBeTruthy();
  });
});
