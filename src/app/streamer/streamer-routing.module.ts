import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StreamerComponent } from './streamer.component';
import { LiveSettingsComponent } from './live-settings/live-settings.component';
import { AuthGuard } from '../@auth/auth.guard';


const routes: Routes = [
  {
    path: 'streamer',
    canActivate: [AuthGuard],
    component: StreamerComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'live-settings',
        component: LiveSettingsComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StreamerRoutingModule { }
