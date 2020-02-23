import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Team } from '../../../shared/models/team.model';
import { GameOptions } from '../../../shared/models/game-options.model';
import { ElectronService } from '../../../core/services';
import { TeamPossession } from '../../../shared/enums/team-possession.enum';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('scoreboard', { static: true }) el: ElementRef;

  @Input() homeTeam: Team = null;
  @Input() awayTeam: Team = null;
  @Input() gameOptions: GameOptions = null;

  constructor(private electronService: ElectronService) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.updateScoreBoard(this.el.nativeElement.innerHTML);
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      this.updateScoreBoard(this.el.nativeElement.innerHTML);
    }, 1);
  }

  updateScoreBoard(content: string) {
    const html = '<html> \
      <head> \
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"> \
        <style type="text/css"> \
          body {\
            background-color: rgba(0, 0, 0, 0); \
            margin: 0px auto; \
            overflow: hidden; \
            width: 1920px; \
            height: 76px; \
          } \
          .teamlogo-scoreboard { \
            height: 50px; \
            transform: skewX(25deg); \
            position: absolute; \
            left: 10px; \
            background: none; \
            border: none; \
          } \
          .teamname-scoreboard { \
            transform: skewX(25deg); \
            position: absolute; \
            left: 70px; \
            font-size: 30px; \
            line-height: 50px; \
            max-width: 225px; \
            white-space: nowrap; \
            overflow: hidden; \
            text-overflow: ellipsis; \
          } \
          .teamscore-scoreboard { \
            transform: skewX(25deg); \
            position: absolute; \
            right: 15px; \
            font-size: 30px; \
            line-height: 50px; \
          } \
          .teamblock-scoreboard { \
            height: 50px; \
            transform: skewX(-25deg); \
          } \
          .teampossession-scoreboard { \
            height: 3px; \
            position: absolute; \
            bottom: -3px; \
            width: 100%; \
          } \
          .teamtimeoutblock-scoreboard { \
            display: flex; \
            position: absolute; \
            bottom: -13px; \
          } \
            .teamtimeout-scoreboard { \
              width: 25px; \
              height: 7px; \
              margin-right: 3px; \
            } \
            .teamtimeout-scoreboard:last-child { \
              margin-right: 0; \
            } \
          .quarter-scoreboard { \
            transform: skewX(25deg); \
            font-size: 30px; \
            line-height: 50px; \
          } \
        </style> \
        <meta http-equiv="refresh" content="1"> \
      </head> \
      <body> \
        <div style="position: absolute; right: 55px; top: 40px;"> \
          ' + content + ' \
        </div> \
      </body> \
    </html>';
    // tslint:disable-next-line: no-unused-expression
    new Promise<any>((resolve, reject) => {
      if (this.electronService.isElectron) {
        this.electronService.ipcRenderer.once('updateScoreboardHTMLResponse', (event, arg) => {
          resolve(arg);
        });
        this.electronService.ipcRenderer.send('updateScoreboardHTML', html);
      } else {
        resolve(null);
      }
    });
  }

  checkPossessionHome(possession: TeamPossession) {
    return possession === TeamPossession.HOME;
  }

}
