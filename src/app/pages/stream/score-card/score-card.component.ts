import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ngx-score-card',
  templateUrl: './score-card.component.html',
  styleUrls: ['./score-card.component.scss']
})
export class ScoreCardComponent {

  @Input() title: string;
  @Input() type: string;
  @Input() on = true;

  @Output() statusChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  onClick() {
    this.on = !this.on;
    this.statusChanged.emit(this.on);
  }

}
