import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {

  let routerService: Router;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: Router, useValue: mockRouter }
    ]
  }));

  it('should be created', () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    expect(service).toBeTruthy();
  });

  it('should use Router Service', () => {
    routerService = TestBed.get(Router);
    expect(routerService).toBeTruthy();
  });
});
