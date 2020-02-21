import {
  Component,
  OnInit,
  Inject,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { NbMenuService, NB_WINDOW } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';
import { Team } from 'src/app/shared/models/team.model';
import { TeamPossession } from 'src/app/shared/enums/team-possession.enum';
import { GameOptions } from 'src/app/shared/models/game-options.model';
import { ObsWebsocketService } from 'src/app/shared/services/obs-websocket.service';
import { AvailableScenes } from 'src/app/shared/enums/available-scenes.enum';
import { ScoreType } from 'src/app/shared/enums/score-type.enum';

@Component({
  selector: 'ngx-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.scss']
})
export class GameControlComponent implements OnInit {

  scoreType = ScoreType;
  teamPossession = TeamPossession;

  @Input() homeTeam: Team;
  @Input() awayTeam: Team;
  @Input() gameOptions: GameOptions;
  @Input() replayPlaying: boolean;

  @Output() teamChanged: EventEmitter<{
    team: Team;
    isHomeTeam: boolean;
  }> = new EventEmitter<{ team: Team; isHomeTeam: boolean }>();
  @Output() scoringAnimation: EventEmitter<ScoreType> = new EventEmitter<ScoreType>();

  @Output() gameOptionsChanged: EventEmitter<GameOptions> = new EventEmitter<GameOptions>();
  @Output() replayPlayingChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  transformationItems = [
    { title: 'Field Goal' },
    { title: 'Conversion à 2 points' }
  ];

  constructor(
    private obsWebsocket: ObsWebsocketService,
    private nbMenuService: NbMenuService,
    @Inject(NB_WINDOW) private window
  ) {
    // this.obsWebsocket.connect('localhost', 4444, '', false).then(async () => {
    // }).catch(err => {
    //   console.error(err);
    // });
  }

  ngOnInit() {
    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'transfo-home-context-menu'),
        map(({ item: { title } }) => title)
      )
      .subscribe(title => {
        if (title === 'Field Goal') {
          this.addPoints(1, true, ScoreType.PAT);
        } else {
          this.addPoints(2, true, ScoreType.EXTRAPOINT);
        }
      });

    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'transfo-away-context-menu'),
        map(({ item: { title } }) => title)
      )
      .subscribe(title => {
        if (title === 'Field Goal') {
          this.addPoints(1, false, ScoreType.PAT);
        } else {
          this.addPoints(2, false, ScoreType.EXTRAPOINT);
        }
      });
  }

  addPoints(points: number, isHomeTeam: boolean, animation: ScoreType) {
    if (isHomeTeam) {
      this.homeTeam.score += points;
      this.teamChanged.emit({ team: this.homeTeam, isHomeTeam });
    } else {
      this.awayTeam.score += points;
      this.teamChanged.emit({ team: this.awayTeam, isHomeTeam });
    }
    this.scoringAnimation.emit(animation);
  }

  changeGameOptions(key: string, value: any) {
    if (key === 'showScoreboard') {
      this.obsWebsocket.SetSceneItemProperties('scoreboard', {
        visible: value,
        'scene-name': AvailableScenes.LIVE,
      }).catch((err: Error) => {
        console.error(err.message);
      });
    }

    this.gameOptions[key] = value;
    this.gameOptionsChanged.emit(this.gameOptions);
  }

  changeReplayState(): void {
    // this.replayPlaying = !this.replayPlaying;
    // this.replayPlayingChanged.emit(this.replayPlaying);
  }
}
