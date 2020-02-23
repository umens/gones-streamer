import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { Scene } from '../../shared/models/scene.model';

@Component({
  selector: 'app-scenes-card',
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
export class ScenesCardComponent implements OnInit, OnChanges {

  cameras = [];
  // @Input() obs: any;
  @Input() scenesLoader = true;
  @Input() camerasLoader = true;
  @Input() scenes: Scene[] = [];
  @Output() scenesChange = new EventEmitter<any>();
  @Output() camerasChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('scenes')) {
      const currentScenes = changes.scenes.currentValue;
      if (currentScenes != null) {
        if (currentScenes.find(scene => scene.active) !== undefined) {
          const currentActiveScene = currentScenes.find(scene => scene.active);
          const cameraSources = currentActiveScene.sources.filter(source => source.name.startsWith('cam'));
          if (cameraSources.length > 0) {
            this.cameras = cameraSources;
          } else {
            this.cameras = [];
          }
        } else {
          this.cameras = [];
        }
      }
    }
    if (changes.hasOwnProperty('scenesLoader')) {
      this.scenesLoader = changes.scenesLoader.currentValue;
    }
    if (changes.hasOwnProperty('camerasLoader')) {
      this.camerasLoader = changes.camerasLoader.currentValue;
    }
  }

  switchCamera(camera) {
    if (camera.render) {
      return false;
    }
    this.camerasChange.emit(camera);
  }

  switchScene(scene) {
    if (scene.active) {
      this.scenesLoader = false;
      return false;
    }
    this.scenesChange.emit(scene);
  }

}
