import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menuHidden = true;

  constructor(
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() { }

  logout() {
    this.authenticationService.logout();
  }

}
