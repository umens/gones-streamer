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

@Component({
  selector: 'ngx-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.scss']
})
export class GameControlComponent implements OnInit {
  @Input() homeTeam: Team;
  @Input() awayTeam: Team;

  @Output() teamChanged: EventEmitter<{
    team: Team;
    isHomeTeam: boolean;
  }> = new EventEmitter<{ team: Team; isHomeTeam: boolean }>();

  transformationItems = [
    { title: 'Field Goal' },
    { title: 'Conversion à 2 points' }
  ];

  constructor(
    private nbMenuService: NbMenuService,
    @Inject(NB_WINDOW) private window
  ) {}

  ngOnInit() {
    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'transfo-home-context-menu'),
        map(({ item: { title } }) => title)
      )
      .subscribe(title => {
        if (title === 'Field Goal') {
          this.addPoints(1, true);
        } else {
          this.addPoints(2, true);
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
          this.addPoints(1, false);
        } else {
          this.addPoints(2, false);
        }
      });
  }

  addPoints(points: number, isHomeTeam: boolean) {
    if (isHomeTeam) {
      this.homeTeam.score += points;
      this.teamChanged.emit({ team: this.homeTeam, isHomeTeam });
    } else {
      this.awayTeam.score += points;
      this.teamChanged.emit({ team: this.awayTeam, isHomeTeam });
    }
  }
}
