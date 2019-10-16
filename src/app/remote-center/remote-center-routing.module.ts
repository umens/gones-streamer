import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RemoteCenterComponent } from './remote-center.component';
import { CockpitComponent } from './cockpit/cockpit.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'cockpit',
    pathMatch: 'full'
  },
  {
    path: 'cockpit',
    component: RemoteCenterComponent,
    children: [
      { path: '', component: CockpitComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemoteCenterRoutingModule { }
