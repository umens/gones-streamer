import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Team } from 'src/app/shared/models/team.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColorEvent } from 'ngx-color';

@Component({
  selector: 'ngx-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.scss']
})
export class TeamCardComponent implements OnInit, OnChanges {
  teamHover = false;
  showColorpicker = false;
  selectingColor = false;

  @Input() team: Team = null;

  @Output() teamChanged: EventEmitter<Team> = new EventEmitter<Team>();

  controls: FormArray;

  constructor() {}

  ngOnInit() {
    const toGroups = [
      new FormGroup({
        name: new FormControl(this.team.name, Validators.required),
        city: new FormControl(this.team.city, Validators.required)
      })
    ];
    this.controls = new FormArray(toGroups);
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes.hasOwnProperty('team')) {
    //   this.team = changes.team.currentValue;
    //   const toGroups = [new FormGroup({
    //     name: new FormControl(this.team.name, Validators.required),
    //     city: new FormControl(this.team.city, Validators.required),
    //   })];
    //   this.controls = new FormArray(toGroups);
    // }
  }

  getControl(field: string) {
    return this.controls.at(0).get(field);
  }

  cancelUpdateField(field: string) {
    const control = this.getControl(field);
    control.patchValue(this.team[field]);
  }

  updateField(field: string) {
    const control = this.getControl(field);
    if (control.valid) {
      this.team = {
        ...this.team,
        [field]: control.value
      };
    }
    this.teamChanged.emit(this.team);
  }

  handleChangeColor($event: ColorEvent) {
    this.team.color = $event.color.hex;
  }

  setScore(score: string | number): void {
    if (typeof score === 'string') {
      score = parseInt(score, 10);
    }
    this.team.score = score;
    this.teamChanged.emit(this.team);
  }

  handleTimeout(num: number) {
    if (num <= this.team.timeout) {
      this.team.timeout = num - 1;
    } else {
      this.team.timeout = num;
    }
    this.teamChanged.emit(this.team);
  }
}
