import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ngx-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.scss']
})
export class TeamCardComponent {

  @Input() title: string;
  @Input() type: string;
  @Input() on = true;

  @Output() statusChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  onClick() {
    this.on = !this.on;
    this.statusChanged.emit(this.on);
  }

}
