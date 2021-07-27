import { TestBed } from '@angular/core/testing';

import { RolRafGuard } from './rol-raf.guard';

describe('RolRafGuard', () => {
  let guard: RolRafGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RolRafGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
