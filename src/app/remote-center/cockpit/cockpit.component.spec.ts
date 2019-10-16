import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { CockpitComponent } from './cockpit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ObsWebsocketService } from '../services/obs-websocket.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

describe('CockpitComponent', () => {
  let component: CockpitComponent;
  let fixture: ComponentFixture<CockpitComponent>;
  let authServiceStub: Partial<AuthenticationService>;
  let routerService: Router;

  authServiceStub = {
    token: {
      refresh_token: 'refreshtokencode',
      exp: new Date((new Date().getDate() + 1)),
      access_token: {
        host: 'localhost',
        port: 4444,
        password: '',
        secure: false
      }
    },
    tokenKey: 'a6smm_utoken'
  };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, SweetAlert2Module],
      declarations: [CockpitComponent],
      providers: [
        { provide: AuthenticationService, useValue: authServiceStub },
        ObsWebsocketService,
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CockpitComponent);
    component = fixture.componentInstance;
    authServiceStub = TestBed.get(AuthenticationService);
    routerService = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
