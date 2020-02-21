/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { ECommerceComponent } from './e-commerce/e-commerce.component';
// import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { DashboardComponent } from './stream/dashboard/dashboard.component';
import { LiveSettingsComponent } from './stream/live-settings/live-settings.component';
import { AuthGuard } from '../@auth/auth.guard';

const routes: Routes = [{
  path: 'pages',
  canActivate: [AuthGuard],
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'live-settings',
      component: LiveSettingsComponent,
    },
    // {
    //   path: 'users',
    //   loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    // },
    // {
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
