import { TestBed } from '@angular/core/testing';

import { GardGuard } from './gard.guard';

describe('GardGuard', () => {
  let guard: GardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
