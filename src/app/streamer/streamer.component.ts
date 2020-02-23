import { Component, OnDestroy } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { NbTokenService } from '@nebular/auth';
import { takeWhile } from 'rxjs/operators';
import { StreamerMenu } from './streamer-menu';

@Component({
  selector: 'app-streamer',
  templateUrl: './streamer.component.html',
  styleUrls: ['./streamer.component.scss']
})
export class StreamerComponent implements OnDestroy {

  menu: NbMenuItem[];
  alive = true;

  constructor(
    private pagesMenu: StreamerMenu,
    private tokenService: NbTokenService,
    // protected initUserService: InitUserService,
  ) {
    this.initMenu();
    this.tokenService.tokenChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.initMenu();
      });
  }

  initMenu() {
    this.pagesMenu.getMenu()
      .pipe(takeWhile(() => this.alive))
      .subscribe(menu => {
        this.menu = menu;
      });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

}
