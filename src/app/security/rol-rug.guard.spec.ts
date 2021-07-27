import { TestBed } from '@angular/core/testing';

import { RolRugGuard } from './rol-rug.guard';

describe('RolRugGuard', () => {
  let guard: RolRugGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RolRugGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
