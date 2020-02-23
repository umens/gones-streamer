import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NbListModule, NbTabsetModule, NbCardModule, NbButtonModule, NbBadgeModule, NbAlertModule, NbToastrModule, NbGlobalPhysicalPosition, NbSpinnerModule, NbIconModule, NbInputModule, NbPopoverModule, NbContextMenuModule, NbMenuModule, NbSelectModule } from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ColorChromeModule } from 'ngx-color/chrome';

import { StreamerRoutingModule } from './streamer-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TeamCardComponent } from './team-card/team-card.component';
import { ScenesCardComponent } from './scenes-card/scenes-card.component';
import { LiveStatusCardComponent } from './live-status-card/live-status-card.component';
import { GameControlComponent } from './game-control/game-control.component';
import { PlayerHighlightComponent } from './player-highlight/player-highlight.component';
import { PartnerRoomComponent } from './partner-room/partner-room.component';
import { ScoreboardComponent } from './game-control/scoreboard/scoreboard.component';
import { LiveSettingsComponent } from './live-settings/live-settings.component';
import { MetricsLiveUpdateChartComponent } from './live-status-card/metrics-live-update-chart.component';
import { FramesMetricsCardComponent } from './frames-metrics-card/frames-metrics-card.component';
import { FramesPieChartComponent } from './frames-metrics-card/frames-pie-chart.component';
import { SharedModule } from '../shared/shared.module';
import { ObsWebsocketService, WebsocketService } from '../shared/services';
import { StreamerComponent } from './streamer.component';
import { StreamerMenu } from './streamer-menu';
import { ThemeModule } from '../@theme/theme.module';
import { AuthModule } from '../@auth/auth.module';


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
    StreamerComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    NbMenuModule,
    AuthModule.forRoot(),
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
    NbSelectModule,
    StreamerRoutingModule
  ],
  providers: [
    ObsWebsocketService,
    WebsocketService,
    StreamerMenu,
  ]
})
export class StreamerModule { }
