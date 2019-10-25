import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TeamCardComponent } from './team-card/team-card.component';
import { TeamCardPlaceholderComponent } from './team-card/team-card-placeholder.component';
import { NbListModule, NbTabsetModule, NbCardModule, NbButtonModule, NbBadgeModule, NbAlertModule } from '@nebular/theme';
import { ScenesCardComponent } from './scenes-card/scenes-card.component';
import { LiveStatusCardComponent } from './live-status-card/live-status-card.component';
import { GameControlComponent } from './game-control/game-control.component';
import { PlayerHighlightComponent } from './player-highlight/player-highlight.component';
import { PartnerRoomComponent } from './partner-room/partner-room.component';
import { ScoreboardComponent } from './game-control/scoreboard/scoreboard.component';


@NgModule({
  declarations: [
    DashboardComponent,
    TeamCardComponent,
    TeamCardPlaceholderComponent,
    ScenesCardComponent,
    LiveStatusCardComponent,
    GameControlComponent,
    PlayerHighlightComponent,
    PartnerRoomComponent,
    ScoreboardComponent,
  ],
  imports: [
    CommonModule,
    NbListModule,
    NbTabsetModule,
    NbCardModule,
    NbButtonModule,
    NbBadgeModule,
    NbAlertModule,
  ]
})
export class StreamModule { }
