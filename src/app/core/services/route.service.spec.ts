import { TestBed, inject } from '@angular/core/testing';

import { Route } from './route.service';
import { ShellComponent } from '../shell/shell.component';

describe('Route', () => {
  let route: Route;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      // AuthenticationGuard,
      // { provide: AuthenticationService, useClass: MockAuthenticationService },
      Route
    ]
  }));

  beforeEach(inject([Route], (ROUTE: Route) => {
    route = ROUTE;
  }));

  describe('withShell', () => {
    it('should create routes as children of shell', () => {
      // Prepare
      const testRoutes = [{ path: 'test' }];

      // Act
      const result = Route.withShell(testRoutes);

      // Assert
      expect(result.path).toBe('');
      expect(result.children).toBe(testRoutes);
      expect(result.component).toBe(ShellComponent);
    });
  });
});
