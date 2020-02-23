/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { NbMenuItem } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class StreamerMenu {

  getMenu(): Observable<NbMenuItem[]> {
    const dashboardMenu: NbMenuItem[] = [
      {
        title: 'Dashboard',
        icon: 'home-outline',
        link: '/streamer',
        children: undefined,
        home: true,
      },
      {
        title: 'Live Settings',
        icon: 'settings-2-outline',
        link: '/streamer/live-settings',
        children: undefined,
      },
    ];

    const menu: NbMenuItem[] = [
      // {
      //   title: 'User',
      //   group: true,
      // },
      // {
      //   title: 'Layout',
      //   icon: 'layout-outline',
      //   children: [
      //     {
      //       title: 'Stepper',
      //       link: '/pages/layout/stepper',
      //     },
      //     {
      //       title: 'List',
      //       link: '/pages/layout/list',
      //     },
      //     {
      //       title: 'Infinite List',
      //       link: '/pages/layout/infinite-list',
      //     },
      //     {
      //       title: 'Accordion',
      //       link: '/pages/layout/accordion',
      //     },
      //     {
      //       title: 'Tabs',
      //       pathMatch: 'prefix',
      //       link: '/pages/layout/tabs',
      //     },
      //   ],
      // },
    ];

    return of([...dashboardMenu, ...menu]);
  }
}
