import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuardService } from './services/auth-guard.service';
import { Route } from './services/route.service';

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
      canActivate: [AuthGuardService],
      loadChildren: '../remote-center/remote-center.module#RemoteCenterModule'
    }]),
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
