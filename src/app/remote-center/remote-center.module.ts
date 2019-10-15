import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemoteCenterRoutingModule } from './remote-center-routing.module';
import { CockpitComponent } from './cockpit/cockpit.component';
import { RemoteCenterComponent } from './remote-center.component';
import { SharedModule } from '../shared/shared.module';
import { ObsWebsocketService } from './services/obs-websocket.service';
import { WebsocketService } from '../shared/services/websocket.service';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [CockpitComponent, RemoteCenterComponent],
  imports: [
    CommonModule,
    RemoteCenterRoutingModule,
    SharedModule,
    SweetAlert2Module
  ],
  providers: [ObsWebsocketService, WebsocketService]
})
export class RemoteCenterModule { }
