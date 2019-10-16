import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  secureSocket = false;

  constructor(private authentication: AuthenticationService) { }

  ngOnInit() {
  }

  login(host, port, password, secure) {
    if (host === '') {
      host = 'localhost';
    }
    if (port === '') {
      port = 4444;
    }
    this.authentication.login(host, port, password, secure);
  }

  changed(evt) {
    this.secureSocket = evt.target.checked;
  }

}
