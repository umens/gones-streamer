import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TeamCardComponent } from './team-card/team-card.component';
import {
  NbListModule,
  NbTabsetModule,
  NbCardModule,
  NbButtonModule,
  NbBadgeModule,
  NbAlertModule,
  NbToastrModule,
  NbGlobalPhysicalPosition,
  NbSpinnerModule,
  NbIconModule,
  NbInputModule,
  NbPopoverModule,
  NbContextMenuModule,
} from '@nebular/theme';
import { ScenesCardComponent } from './scenes-card/scenes-card.component';
import { LiveStatusCardComponent } from './live-status-card/live-status-card.component';
import { GameControlComponent } from './game-control/game-control.component';
import { PlayerHighlightComponent } from './player-highlight/player-highlight.component';
import { PartnerRoomComponent } from './partner-room/partner-room.component';
import { ScoreboardComponent } from './game-control/scoreboard/scoreboard.component';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { LiveSettingsComponent } from './live-settings/live-settings.component';
import { MetricsLiveUpdateChartComponent } from './live-status-card/metrics-live-update-chart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { FramesMetricsCardComponent } from './frames-metrics-card/frames-metrics-card.component';
import { FramesPieChartComponent } from './frames-metrics-card/frames-pie-chart.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ColorChromeModule } from 'ngx-color/chrome';
import { ObsWebsocketService } from 'src/app/shared/services/obs-websocket.service';

@NgModule({
  declarations: [
    DashboardComponent,
    TeamCardComponent,
    ScenesCardComponent,
    LiveStatusCardComponent,
    GameControlComponent,
    PlayerHighlightComponent,
    PartnerRoomComponent,
    ScoreboardComponent,
    LiveSettingsComponent,
    MetricsLiveUpdateChartComponent,
    FramesMetricsCardComponent,
    FramesPieChartComponent,
  ],
  imports: [
    CommonModule,
    NbListModule,
    NbTabsetModule,
    NbCardModule,
    NbButtonModule,
    NbBadgeModule,
    NbAlertModule,
    NbToastrModule.forRoot({
      position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
    }),
    NbSpinnerModule,
    NgxEchartsModule,
    NbIconModule,
    SharedModule,
    NbInputModule,
    SweetAlert2Module,
    ColorChromeModule,
    NbPopoverModule,
    NbContextMenuModule,
  ],
  providers: [ObsWebsocketService, WebsocketService]
})
export class StreamModule { }
