import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemoteCenterRoutingModule } from './remote-center-routing.module';
import { RemoteCenterComponent } from './remote-center.component';
import { CockpitComponent } from './cockpit/cockpit.component';

import { ObsWebsocketService } from './services/obs-websocket.service';
import { SharedModule } from '../shared/shared.module';
import { WebsocketService } from '../shared/services/websocket.service';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';


@NgModule({
  declarations: [RemoteCenterComponent, CockpitComponent],
  imports: [
    CommonModule,
    RemoteCenterRoutingModule,
    SharedModule,
    SweetAlert2Module
  ],
  providers: [ObsWebsocketService, WebsocketService]
})
export class RemoteCenterModule { }
