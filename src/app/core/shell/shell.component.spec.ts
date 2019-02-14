import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ShellComponent } from './shell.component';
import { Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  // let titleService: Title;
  // let routerService: Router;
  // const mockRouter = {
  //   navigate: jasmine.createSpy('navigate'),
  //   events: Observable.of(new NavigationEnd(0, 'http://localhost:4200/login', 'http://localhost:4200/login'));
  // };
  class MockRouter {
    public ne = new NavigationEnd(0, 'http://localhost:4200/login', 'http://localhost:4200/login');
    public events = new Observable(observer => {
      observer.next(this.ne);
      observer.complete();
    });
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShellComponent, HeaderComponent, FooterComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: Router, useClass: MockRouter },
        Title
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    // routerService = TestBed.get(Router);
    // titleService = TestBed.get(Title);
    fixture.detectChanges();
  });

  // it('should use Router Service', () => {
  //   routerService = TestBed.get(Router);
  //   expect(routerService).toBeTruthy();
  // });

  // it('should use Title Service', () => {
  //   titleService = TestBed.get(Title);
  //   expect(titleService).toBeTruthy();
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
