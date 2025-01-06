import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isauthGuard } from './isauth.guard';

describe('isauthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isauthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
