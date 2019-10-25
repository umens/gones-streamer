import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'ngx-scenes-card',
  templateUrl: './scenes-card.component.html',
  styleUrls: ['./scenes-card.component.scss'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({
          // opacity: 0,
          flex: '0 0 0% !important',
          'max-width': '0%',
        }),
        animate('700ms', style({
          // opacity: 1,
          flex: '0 0 41.6666666667% !important',
          'max-width': '41.6666666667%',
         })),
      ]),
      transition(':leave', [
        animate('700ms', style({
          // opacity: 0,
          flex: '0 0 0% !important',
          'max-width': '0%',
        }))
      ])
    ]),
  ]
})
export class ScenesCardComponent implements OnInit {

  private cameraAvailable = false;
  private cameras = [];
  @Input() scenes = [];

  constructor() { }

  ngOnInit() {
  }

}
