import { TestBed } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

describe('AuthGuardService', () => {

  let routerService: Router;
  let authentificationService: AuthenticationService;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: Router, useValue: mockRouter },
      AuthenticationService
    ]
  }));

  it('should use Router Service', () => {
    routerService = TestBed.get(Router);
    expect(routerService).toBeTruthy();
  });

  it('should use Authentication Service', () => {
    authentificationService = TestBed.get(AuthenticationService);
    expect(authentificationService).toBeTruthy();
  });

  it('should be created', () => {
    const service: AuthGuardService = TestBed.get(AuthGuardService);
    expect(service).toBeTruthy();
  });
});
