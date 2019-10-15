import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Route } from './services/route.service';

import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'remote-center',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  Route.withShell([
    {
      path: 'remote-center',
      canActivate: [AuthGuard],
      loadChildren: '../remote-center/remote-center.module#RemoteCenterModule'
    }]),
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
