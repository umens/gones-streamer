import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Team } from 'src/app/shared/models/team.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.scss']
})
export class TeamCardComponent implements OnInit, OnChanges {

  @Input() team: Team = null;

  @Output() statusChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  controls: FormArray;

  constructor() {}

  // onClick() {
  //   console.log(this.team);
  //   // this.statusChanged.emit(this.on);
  // }

  ngOnInit() {
    // this.team = new Team({ name: 'Team name', city: 'Team city'})
    const toGroups = [new FormGroup({
        name: new FormControl(this.team.name, Validators.required),
        city: new FormControl(this.team.city, Validators.required),
      })];
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
  }

}
