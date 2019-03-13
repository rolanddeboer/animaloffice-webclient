import { TestBed } from '@angular/core/testing';

import { BreederNumberHandlerService } from './breeder-number-handler.service';

describe('BreederNumberHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BreederNumberHandlerService = TestBed.get(BreederNumberHandlerService);
    expect(service).toBeTruthy();
  });
});
