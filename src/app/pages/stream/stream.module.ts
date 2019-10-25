import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ScoreCardComponent } from './score-card/score-card.component';
import { ScoreCardPlaceholderComponent } from './score-card/score-card-placeholder.component';
import { NbListModule, NbTabsetModule, NbCardModule, NbButtonModule, NbBadgeModule } from '@nebular/theme';
import { ScenesCardComponent } from './scenes-card/scenes-card.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ScoreCardComponent,
    ScoreCardPlaceholderComponent,
    ScenesCardComponent,
  ],
  imports: [
    CommonModule,
    NbListModule,
    NbTabsetModule,
    NbCardModule,
    NbButtonModule,
    NbBadgeModule,
  ]
})
export class StreamModule { }
