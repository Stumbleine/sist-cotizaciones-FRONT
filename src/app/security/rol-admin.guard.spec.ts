import { TestBed } from '@angular/core/testing';

import { RolAdminGuard } from './rol-admin.guard';

describe('RolAdminGuard', () => {
  let guard: RolAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RolAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
