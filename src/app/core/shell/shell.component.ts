import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {

  title: string;

  constructor(
    private router: Router,
    private titleService: Title,
  ) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.title = this.titleService.getTitle();
      }
    });

  }

}
