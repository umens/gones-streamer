import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

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

  it('should use Router Service', () => {
    routerService = TestBed.get(Router);
    expect(routerService).toBeTruthy();
  });

  it('should be created', () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    expect(service).toBeTruthy();
  });
});
