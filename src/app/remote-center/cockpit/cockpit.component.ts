import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { ObsWebsocketService } from '../services/obs-websocket.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

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
  scoreGones = '00';
  scoreAway = '00';
  currentQuarter = 'Q1';
  flagThrown = false;
  /**
   * @deprecated
   */
  score = '00 - 00';
  awayTeamName = '';
  awayTeamCityName = '';
  forGones: boolean = null;
  hoverStop = false;
  isReady = false;

  playingReplay = false;
  activeCam = '- Cam 1';
  scoreboardVisible = true;
  activeScene = 'Live Scene';

  isStreaming = false;
  isRecording = false;

  streamLength = 0;
  droppedFrames = 0;
  totalFrames = 0;

  droppedFramesPercent = 0.00;
  transmittionSpeed = 0.00;
  transmittionSpeedB = 0.00;
  fps = 0.00;

  @ViewChild('touchdownSwal', {static: false}) private touchdownSwal: SwalComponent;
  @ViewChild('teamTouchdownSwal', {static: false}) private teamTouchdownSwal: SwalComponent;
  @ViewChild('teamSafetySwal', {static: false}) private teamSafetySwal: SwalComponent;
  @ViewChild('teamFieldGoalSwal', {static: false}) private teamFieldGoalSwal: SwalComponent;

  constructor(
    private authenticationService: AuthenticationService,
    private obsWebsocket: ObsWebsocketService
  ) {
    this.obsWebsocket.connect(
      this.authenticationService.token.access_token.host,
      this.authenticationService.token.access_token.port,
      this.authenticationService.token.access_token.password,
      this.authenticationService.token.access_token.secure
    ).then(() => {
      this.loadScenes();
      this.getScore();
      this.getAwayTeamName();
      this.getAwayTeamCityName();
      this.getCurrentQuarter();
      this.getStreamStatus();
      this.setStudioModeOff();
      this.getProfiles();
      this.setScoreBoardVisibility(true);
      this.setFlagVisibility(false);
    }).catch(err => {
      console.error(err);
    });

    this.subscription = this.obsWebsocket.eventSource$.subscribe(event => this.workOnEvent(event));
  }

  ngOnInit(): void {
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
        // tslint:disable-next-line: no-string-literal
        this.scenes.find(scene => scene.name === event['scene-name']).sources = event['sources'];
        this.activeScene = event['scene-name'];
        break;
      case 'StreamStatus':
        // tslint:disable-next-line: no-string-literal
        this.isStreaming = event['streaming'];
        // tslint:disable-next-line: no-string-literal
        this.isRecording = event['recording'];
        this.streamLength = event['total-stream-time'];

        // tslint:disable-next-line: no-string-literal
        this.fps = event['fps'];
        this.droppedFrames = event['num-dropped-frames'];
        this.totalFrames = event['num-total-frames'];
        // tslint:disable-next-line: no-string-literal
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
        // console.debug(event);
        break;

      case 'StreamStarted':
        this.isStreaming = true;
        break;

      case 'StreamStopped':
        this.isStreaming = false;
        break;

      default:
        // tslint:disable-next-line:no-console
        // console.debug(event);
        break;
    }
  }

  loadScenes() {
    this.obsWebsocket.getScenesList()
      .then((data: any) => {
        data.scenes.forEach(element => {
          if (element.name.startsWith('*') || element.name.startsWith('-')) {
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
      .then(() => {
        this.activeScene = name;
      })
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

  /**
   * @deprecated
   */
  setAwayTeamNameAndCity(name: string, city: string) {
    this.obsWebsocket.SetTextGDIPlusProperties('Away Team Name Txt', { text: name + '\n' + city })
      .catch((err: Error) => {
        console.error(err.message);
      });
  }
  /**
   * @deprecated
   */
  getAwayTeamNameAndCity() {
    this.obsWebsocket.GetTextGDIPlusProperties('Away Team Name')
      .then(data => {
        this.awayTeamName = data.text.split(/\r?\n/)[0];
      }).catch((err: Error) => {
        console.error(err.message);
      });
  }

  setAwayTeamName(name: string) {
    this.obsWebsocket.SetTextGDIPlusProperties('Away Team Name Txt', { text: name })
      .catch((err: Error) => {
        console.error(err.message);
      });
  }
  getAwayTeamName() {
    this.obsWebsocket.GetTextGDIPlusProperties('Away Team Name Txt')
      .then(data => {
        this.awayTeamName = data.text;
      }).catch((err: Error) => {
        console.error(err.message);
      });
  }
  setAwayTeamCityName(city: string) {
    this.obsWebsocket.SetTextGDIPlusProperties('Away Team Name City Txt', { text: city })
      .catch((err: Error) => {
        console.error(err.message);
      });
  }
  getAwayTeamCityName() {
    this.obsWebsocket.GetTextGDIPlusProperties('Away Team Name City Txt')
      .then(data => {
        this.awayTeamCityName = data.text;
      }).catch((err: Error) => {
        console.error(err.message);
      });
  }

  getScore() {
    this.obsWebsocket.GetTextGDIPlusProperties('Home Team Score Txt')
      .then(dataHome => {
        this.scoreGones = dataHome.text;
        return this.obsWebsocket.GetTextGDIPlusProperties('Away Team Score Txt');
      })
      .then(dataAway => {
        this.scoreAway = dataAway.text;
      }).catch((err: Error) => {
        console.error(err.message);
      });
  }

  setScoreManuallyForGones(score: number) {
    this.forGones = true;
    this.addScore(score, true);
  }

  setScoreManuallyForAway(score: number) {
    this.forGones = false;
    this.addScore(score, true);
  }

  addScore(score: number, manually?: boolean) {
    manually = (manually === undefined) ? false : manually;
    score = Number(score);
    if (this.forGones) {
      this.scoreGones = (!manually) ? (Number(this.scoreGones) + score) + '' : score + '';
      this.scoreGones = (this.scoreGones.length === 1) ? '0' + this.scoreGones : this.scoreGones;
      this.setScoreGones();
    } else {
      this.scoreAway = (!manually) ? (Number(this.scoreAway) + score) + '' : score + '';
      this.scoreAway = (this.scoreAway.length === 1) ? '0' + this.scoreAway : this.scoreAway;
      this.setScoreAway();
    }
    // this.score = scores[0] + ' - ' + scores[1];
    // this.SetScore();
  }

  /**
   * @deprecated
   */
  SetScore() {
    this.obsWebsocket.SetTextGDIPlusProperties('text-score', { text: this.score })
      .catch((err: Error) => {
        console.error(err.message);
      });
  }
  setScoreGones() {
    this.obsWebsocket.SetTextGDIPlusProperties('Home Team Score Txt', { text: this.scoreGones })
      .catch((err: Error) => {
        console.error(err.message);
      });
  }
  setScoreAway() {
    this.obsWebsocket.SetTextGDIPlusProperties('Away Team Score Txt', { text: this.scoreAway })
      .catch((err: Error) => {
        console.error(err.message);
      });
  }

  getCurrentQuarter() {
    this.obsWebsocket.GetTextGDIPlusProperties('Current Quarter')
      .then(data => {
        this.currentQuarter = data.text;
      }).catch((err: Error) => {
        console.error(err.message);
      });
  }
  setCurrentQuarter(quarter: string) {
    this.currentQuarter = quarter;
    this.obsWebsocket.SetTextGDIPlusProperties('Current Quarter', { text: this.currentQuarter })
      .catch((err: Error) => {
        console.error(err.message);
      });
  }

  newTouchdown(forGones: string) {
    this.obsWebsocket.SetSceneItemProperties('* Touchdown animation', { visible: true, 'scene-name': 'Live Scene' })
      .then(data => {
        this.forGones = (forGones === 'false') ? false : true;
        this.touchdownSwal.fire();
        setTimeout(() => {
          return this.obsWebsocket.SetSceneItemProperties('* Touchdown animation', { visible: false, 'scene-name': 'Live Scene' });
        }, 5000);
      }).then(data => {
        // tslint:disable-next-line:no-console
        console.debug('new touchdown');
      }).catch((err: Error) => {
        console.error(err.message);
      });
  }

  newFieldGoal(forGones: string) {
    this.obsWebsocket.SetSceneItemProperties('* FieldGoal animation', { visible: true, 'scene-name': 'Live Scene' })
      .then(data => {
        this.forGones = (forGones === 'false') ? false : true;
        this.addScore(3);
        setTimeout(() => {
          return this.obsWebsocket.SetSceneItemProperties('* FieldGoal animation', { visible: false, 'scene-name': 'Live Scene' });
        }, 5000);
      }).then(data => {
        // tslint:disable-next-line:no-console
        console.debug('new field goal');
      }).catch((err: Error) => {
        console.error(err.message);
      });
  }

  transfoSucceed(point: string): void {
    // tslint:disable-next-line: radix
    const addedPoints = Number.parseInt(point);
    this.addScore(addedPoints);
    if (addedPoints > 6) {
      this.obsWebsocket.SetSceneItemProperties('* Transfo animation', { visible: true, 'scene-name': 'Live Scene' })
        .then(data => {
          setTimeout(() => {
            return this.obsWebsocket.SetSceneItemProperties('* Transfo animation', { visible: false, 'scene-name': 'Live Scene' });
          }, 5000);
        }).then(data => {
          // tslint:disable-next-line:no-console
          console.debug('new field goal');
        }).catch((err: Error) => {
          console.error(err.message);
        });
    }
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
            this.obsWebsocket.setCurrentScene('* Replay').then(data2 => {
              this.activeScene = '* Replay';
              setTimeout(() => {
                this.obsWebsocket.setCurrentScene('Live Scene').then(data3 => {
                  this.activeScene = 'Live Scene';
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
          this.setCurrentScene('Live Scene');
          // tslint:disable-next-line:no-console
          console.debug('Stream restarted');
        }).catch((err: Error) => {
          console.error(err.message);
        });
    }
  }

  startLive(name: string, city: string) {
    this.setAwayTeamName(name);
    this.setAwayTeamCityName(city);
    this.scoreGones = '00';
    this.scoreAway = '00';
    this.setScoreGones();
    this.setScoreAway();
    this.currentQuarter = 'Q1';
    this.setCurrentQuarter('Q1');
    // this.score = '00 - 00';
    // this.SetScore();
    this.isReady = true;
    if (!this.isStreaming) {
      this.obsWebsocket.setCurrentScene('* First scene')
        .then(data => {
          this.activeScene = '* First scene';
          return this.obsWebsocket.StartStreaming();
        }).then(data => {
          this.isStreaming = true;
          return this.obsWebsocket.StartReplayBuffer();
        }).then(data => {
          return this.obsWebsocket.setCurrentScene('Pre Game');
        }).then(data => {
          this.activeScene = 'Pre Game';
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
          return this.obsWebsocket.setCurrentScene('* First scene');
        }).then(data => {
          this.activeScene = '* First scene';
          this.scoreGones = '00';
          this.scoreAway = '00';
          this.setScoreGones();
          this.setScoreAway();
          this.currentQuarter = 'Q1';
          this.setCurrentQuarter('Q1');
          // this.score = '00 - 00';
          // this.SetScore();
        }).then(data => {
          // tslint:disable-next-line:no-console
          console.debug('Stream stopped');
        }).catch((err: Error) => {
          console.error(err);
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

  setScoreBoardVisibility(visible: boolean): any {
    this.obsWebsocket.SetSceneItemProperties('- Score Board', { visible, 'scene-name': 'Live Scene' })
      .then(() => {
        this.scoreboardVisible = visible;
      })
      .catch((err: Error) => {
        console.error(err.message);
      });
  }

  setFlagVisibility(visible: boolean): any {
    this.obsWebsocket.SetSceneItemProperties('Animation Flag', { visible, 'scene-name': '- Score Board' })
      .then(() => {
        this.flagThrown = visible;
      })
      .catch((err: Error) => {
        console.error(err.message);
      });
  }

  changeLiveCam(camName: string): any {
    if (this.activeScene !== 'Live Scene') {
      if (this.activeCam !== camName) {
        this.obsWebsocket.setCurrentScene('Live Scene')
          .then(() => {
            this.activeScene = 'Live Scene';
            return this.obsWebsocket.SetSceneItemProperties(camName, { visible: true, 'scene-name': 'Live Scene' });
          })
          .then(() => {
            return this.obsWebsocket.SetSceneItemProperties(this.activeCam, { visible: false, 'scene-name': 'Live Scene' });
          })
          .then(() => {
            this.activeCam = camName;
          })
          .catch((err: Error) => {
            console.error(err.message);
          });
      } else {
        this.setCurrentScene('Live Scene');
      }
    } else {
      if (this.activeCam !== camName) {
        this.obsWebsocket.SetSceneItemProperties(camName, { visible: true, 'scene-name': 'Live Scene' })
          .then(() => {
            return this.obsWebsocket.SetSceneItemProperties(this.activeCam, { visible: false, 'scene-name': 'Live Scene' });
          })
          .then(() => {
            this.activeCam = camName;
          })
          .catch((err: Error) => {
            console.error(err.message);
          });
      }
    }
  }
}

