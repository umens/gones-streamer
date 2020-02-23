/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  AppAuthComponent,
  AppLoginComponent,
  AppRegisterComponent,
  AppLogoutComponent,
  AppRequestPasswordComponent,
  AppResetPasswordComponent,
} from './components';

const routes: Routes = [{
  path: 'auth',
  component: AppAuthComponent,
  children: [
    {
      path: '',
      component: AppLoginComponent,
    },
    {
      path: 'login',
      component: AppLoginComponent,
    },
    {
      path: 'register',
      component: AppRegisterComponent,
    },
    {
      path: 'logout',
      component: AppLogoutComponent,
    },
    {
      path: 'request-password',
      component: AppRequestPasswordComponent,
    },
    {
      path: 'reset-password',
      component: AppResetPasswordComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
