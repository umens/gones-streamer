import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {

  private alive = true;
  scenes = [];

  constructor() { }

  click() {
    // this.scenes = !this.scenes;
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
