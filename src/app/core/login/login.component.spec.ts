import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../services/authentication.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceStub: Partial<AuthenticationService>;

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [{ provide: AuthenticationService, useValue: authServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceStub = TestBed.get(AuthenticationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should display starter View"', () => {
  //   authServiceStub.login('localhost', 4444, '');
  //   fixture.detectChanges();
  //   expect(fixture.nativeElement.querySelector('button')[0].textContent).toContain('Start Live !');
  // });

  it('should ask for Login', () => {
    fixture.detectChanges();
    const content = fixture.nativeElement;
    expect(content.querySelector('h1').textContent).toContain('Connect to OBS Server', '"Connect to OBS Server ..."');
    expect(content.querySelector('button').textContent).toContain('Connect', '"Connect ..."');
  });

});
