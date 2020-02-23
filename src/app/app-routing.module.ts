import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'streamer',
    pathMatch: 'full'
  },
  // {path: '404', component: NotFoundComponent },
  {path: '**', component: NotFoundComponent },
  // {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        useHash: true,
        // enableTracing: true
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
