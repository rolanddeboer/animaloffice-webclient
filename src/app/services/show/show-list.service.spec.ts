import { TestBed } from '@angular/core/testing';

import { ShowListService } from './show-list.service';

describe('ShowListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShowListService = TestBed.get(ShowListService);
    expect(service).toBeTruthy();
  });
});
