import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ObsWebsocketService } from '../services/obs-websocket.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Subscription } from 'rxjs';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.scss']
})
export class CockpitComponent implements OnInit, OnDestroy {

  profiles: any[] = null;
  scenes: any[] = null;
  socketConnected = false;
  subscription: Subscription;
  score = '00 - 00';
  awayTeamName = '';
  forGones: boolean = null;
  hoverStop = false;
  isReady = false;

  playingReplay = false;

  isStreaming = false;
  isRecording = false;

  streamLength = 0;
  droppedFrames = 0;
  totalFrames = 0;

  droppedFramesPercent = 0.00;
  transmittionSpeed = 0.00;
  transmittionSpeedB = 0.00;
  fps = 0.00;

  @ViewChild('touchdownSwal') private touchdownSwal: SwalComponent;
  @ViewChild('teamTouchdownSwal') private teamTouchdownSwal: SwalComponent;
  @ViewChild('teamSafetySwal') private teamSafetySwal: SwalComponent;
  @ViewChild('teamFieldGoalSwal') private teamFieldGoalSwal: SwalComponent;

  constructor(
    private authenticationService: AuthenticationService,
    private obsWebsocket: ObsWebsocketService
  ) {
    this.obsWebsocket.connect(
      this.authenticationService.token.access_token.host,
      this.authenticationService.token.access_token.port,
      this.authenticationService.token.access_token.password
    ).then(() => {
      this.loadScenes();
      this.getScore();
      this.getAwayTeamName();
      this.getStreamStatus();
      this.setStudioModeOff();
      this.getProfiles();
    }).catch(err => {
      console.error(err);
    });

    this.subscription = this.obsWebsocket.eventSource$.subscribe(event => this.workOnEvent(event));
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
    this.obsWebsocket.disconnect();
  }

  workOnEvent(event: string): void {
    switch (event['update-type']) {
      case 'SceneItemVisibilityChanged':
        this.scenes.find(scene => scene.active).sources.find(source => source.name === event['item-name']).render = event['item-visible'];
        break;
      case 'SwitchScenes':
        this.scenes.find(scene => scene.active).active = false;
        this.scenes.find(scene => scene.name === event['scene-name']).active = true;
        this.scenes.find(scene => scene.name === event['scene-name']).sources = event['sources'];
        break;
      case 'StreamStatus':
        this.isStreaming = event['streaming'];
        this.isRecording = event['recording'];
        this.streamLength = event['total-stream-time'];

        this.fps = event['fps'];
        this.droppedFrames = event['num-dropped-frames'];
        this.totalFrames = event['num-total-frames'];
        this.droppedFramesPercent = event['strain'];
        this.transmittionSpeed = event['kbits-per-sec'];
        this.transmittionSpeedB = event['bytes-per-sec'];
        // {
        //   bytes - per - sec: 63972
        //   fps: 30.000000300000007
        //   kbits - per - sec: 499
        //   num - dropped - frames: 1165
        //   num - total - frames: 1473
        //   preview - only: false
        //   recording: false
        //   strain: 1
        //   stream - timecode: "00:00:50.014"
        //   streaming: true
        //   total - stream - time: 50
        //   update - type: "StreamStatus"
        // }
        break;

      case 'TransitionBegin':
        break;
      case 'StudioModeSwitched':
      case 'StreamStarting':
      case 'StreamStopping':
      case 'ReplayStarting':
      case 'ReplayStarted':
      case 'ReplayStopping':
      case 'ReplayStopped':
        // tslint:disable-next-line:no-console
        console.debug(event);
        break;

      case 'StreamStarted':
        this.isStreaming = true;
        break;

      case 'StreamStopped':
        this.isStreaming = false;
        break;

      default:
        // tslint:disable-next-line:no-console
        console.debug(event);
        break;
    }
  }

  loadScenes() {
    this.obsWebsocket.getScenesList()
      .then((data: any) => {
        // this.scenes = data.scenes.filter(scene => !(scene.name.startsWith('*')
        //   || scene.name.startsWith('_')
        //   || scene.name.startsWith('-')));
        data.scenes.forEach(element => {
          if ((element.name.startsWith('*')
            || element.name.startsWith('_')
            || element.name.startsWith('-')
            || (element.name === 'First scene' || element.name === 'Replay'))) {
            element.displayable = false;
            element.liveCam = false;
          } else {
            if (element.name.startsWith('Live')) {
              element.liveCam = true;
            } else {
              element.liveCam = false;
            }
            element.displayable = true;
          }
        });
        this.scenes = data.scenes;
        // this.scenes.find(scene => !(scene.name.startsWith('*')
        //   || scene.name.startsWith('_')
        //   || scene.name.startsWith('-'))).displayable = false;
      }).then(data => {
        return this.obsWebsocket.getCurrentScene();
      }).then((current: any) => {
        this.scenes.find(scene => scene.name === current.name).active = true;
      }).catch((err: Error) => {
        console.error(err.message);
      });
  }

  getProfiles(): void {
    this.obsWebsocket.getProfilesList().then((data: any) => {
      this.profiles = data.profiles.filter(profile => !profile['profile-name'].startsWith('Test'));
      this.profiles.forEach(element => {
        element.type = (element['profile-name'].includes('FB')) ? 'facebook' : 'youtube';
      });
      return;
    }).then(() => {
      return this.obsWebsocket.GetCurrentProfile();
    }).then((data: any) => {
      this.profiles.find(profile => profile['profile-name'] === data['profile-name']).active = true;
      this.profiles.find(profile => profile['profile-name'] !== data['profile-name']).active = false;
    }).catch((err: Error) => {
      console.error(err.message);
    });
  }

  getStreamStatus() {
    this.obsWebsocket.GetStreamingStatus()
      .then((data: any) => {
        this.isReady = (data.streaming) ? true : false;
        this.isStreaming = (data.streaming) ? true : false;
        this.isRecording = (data.recording) ? true : false;
      }).catch((err: Error) => {
        console.error(err.message);
      });
  }

  setCurrentScene(name: string): void {
    this.obsWebsocket.setCurrentScene(name)
      .catch((err: Error) => {
        console.error(err.message);
      });
  }

  setStudioModeOff(): void {
    this.obsWebsocket.DisableStudioMode()
      .catch((err: Error) => {
        console.error(err.message);
      });
  }

  changeSourceDiplsay(source: any): void {
    this.obsWebsocket.SetSceneItemProperties(source.name, { visible: !source.render })
      .catch((err: Error) => {
        console.error(err.message);
      });
  }

  setAwayTeamName(name: string, city: string) {
    this.obsWebsocket.SetTextGDIPlusProperties('Away Team Name', { text: name + '\n' + city })
      .catch((err: Error) => {
        console.error(err.message);
      });
  }
  getAwayTeamName() {
    this.obsWebsocket.GetTextGDIPlusProperties('Away Team Name')
      .then(data => {
        this.awayTeamName = data.text.split(/\r?\n/)[0];
      }).catch((err: Error) => {
        console.error(err.message);
      });
  }

  getScore() {
    this.obsWebsocket.GetTextGDIPlusProperties('text-score')
      .then(data => {
        this.score = data.text;
      }).catch((err: Error) => {
        console.error(err.message);
      });
  }

  setScoreManuallyForGones(score: number) {
    this.forGones = true;
    this.addScore(score);
  }

  setScoreManuallyForAway(score: number) {
    this.forGones = false;
    this.addScore(score);
  }

  addScore(score: number) {
    score = Number(score);
    const scores = this.score.split(' - ');
    if (this.forGones) {
      scores[0] = (Number(scores[0]) + score) + '';
      scores[0] = (scores[0].length === 1) ? '0' + scores[0] : scores[0];
    } else {
      scores[1] = (Number(scores[1]) + score) + '';
      scores[1] = (scores[1].length === 1) ? '0' + scores[1] : scores[1];
    }
    this.score = scores[0] + ' - ' + scores[1];
    this.SetScore();
  }

  SetScore() {
    this.obsWebsocket.SetTextGDIPlusProperties('text-score', { text: this.score })
      .catch((err: Error) => {
        console.error(err.message);
      });
  }

  newTouchdown(forGones: string) {
    this.obsWebsocket.SetSceneItemProperties('- Touchdown animation', { visible: true, 'scene-name': 'Live Caméra 1' })
      .then(data => {
        this.forGones = (forGones === 'false') ? false : true;
        this.touchdownSwal.show();
        setTimeout(() => {
          return this.obsWebsocket.SetSceneItemProperties('- Touchdown animation', { visible: false, 'scene-name': 'Live Caméra 1' });
        }, 5000);
      }).then(data => {
        // tslint:disable-next-line:no-console
        console.debug('new touchdown');
      }).catch((err: Error) => {
        console.error(err.message);
      });
    // this.obsWebsocket.SetSceneItemProperties('- Touchdown animation', { visible: true, 'scene-name': 'Live Caméra 2' }).then(data => {
    //   setTimeout(() => {
    //     this.obsWebsocket.SetSceneItemProperties('- Touchdown animation', { visible: false, 'scene-name': 'Live Caméra 2' });
    //   }, 5000);
    // });
  }

  newFieldGoal(forGones: string) {
    this.forGones = (forGones === 'false') ? false : true;
    this.addScore(3);
  }

  newSafety(forGones: string) {
    this.forGones = (forGones === 'false') ? false : true;
    this.addScore(2);
  }

  startReplay() {
    if (!this.playingReplay) {
      this.playingReplay = true;
      this.obsWebsocket.SaveReplayBuffer()
        .then(data => {
          setTimeout(() => {
            this.obsWebsocket.setCurrentScene('Replay').then(data2 => {
              setTimeout(() => {
                this.obsWebsocket.setCurrentScene('Live Caméra 1').then(data3 => {
                  this.playingReplay = false;
                });
              }, 15000);
            });
          }, 5000);
        }).catch((err: Error) => {
          console.error(err.message);
        });
    }
  }

  restartLive() {
    this.isReady = true;
    if (!this.isStreaming) {
      this.obsWebsocket.StartStreaming()
        .then(data => {
          this.isStreaming = true;
          return this.obsWebsocket.StartReplayBuffer();
        }).then(data => {
          // tslint:disable-next-line:no-console
          console.debug('Stream restarted');
        }).catch((err: Error) => {
          console.error(err.message);
        });
    }
  }

  startLive(name: string, city: string) {
    this.setAwayTeamName(name, city);
    this.score = '00 - 00';
    this.SetScore();
    this.isReady = true;
    if (!this.isStreaming) {
      this.obsWebsocket.setCurrentScene('First scene')
        .then(data => {
          return this.obsWebsocket.StartStreaming();
        }).then(data => {
          this.isStreaming = true;
          return this.obsWebsocket.StartReplayBuffer();
        }).then(data => {
          return this.obsWebsocket.setCurrentScene('Pre Game');
        }).then(data => {
          // tslint:disable-next-line:no-console
          console.debug('Stream started');
        }).catch((err: Error) => {
          console.error(err.message);
        });
    }
  }

  stopLive() {
    if (this.isStreaming) {
      this.obsWebsocket.StopStreaming()
        .then(data => {
          this.isStreaming = false;
          return this.obsWebsocket.StopReplayBuffer();
        }).then(data => {
          return this.obsWebsocket.setCurrentScene('First scene');
        }).then(data => {
          this.score = '00 - 00';
          this.SetScore();
        }).then(data => {
          // tslint:disable-next-line:no-console
          console.debug('Stream stopped');
        }).catch((err: Error) => {
          console.error(err.message);
        });
    }
  }

  switchProfile(name: string): void {
    this.obsWebsocket.SetCurrentProfile(name).then(() => {
      this.profiles.find(profile => profile['profile-name'] === name).active = true;
      this.profiles.find(profile => profile['profile-name'] !== name).active = false;
    }).catch((err: Error) => {
      console.error(err.message);
    });
  }

}
