import { TestBed, async, inject } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('AuthGuard', () => {

  let routerService: Router;
  let authentificationService: AuthenticationService;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // AuthGuard,
        { provide: Router, useValue: mockRouter },
        AuthenticationService
      ]
    });
  });

  // it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
  //   expect(guard).toBeTruthy();
  // }));

  it('should use Router Service', () => {
    routerService = TestBed.get(Router);
    expect(routerService).toBeTruthy();
  });

  it('should use Authentication Service', () => {
    authentificationService = TestBed.get(AuthenticationService);
    expect(authentificationService).toBeTruthy();
  });

  it('should be created', () => {
    const service: AuthGuard = TestBed.get(AuthGuard);
    expect(service).toBeTruthy();
  });
});
