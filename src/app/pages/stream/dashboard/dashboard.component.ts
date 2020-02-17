import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NbToastrService } from '@nebular/theme';
import { ElectronService } from 'ngx-electron';

import { Team } from 'src/app/shared/models/team.model';
import { ObsWebsocketService } from 'src/app/shared/services/obs-websocket.service';
import { TeamPossession } from 'src/app/shared/enums/team-possession.enum';
import { GameOptions } from 'src/app/shared/models/game-options.model';
import { LiveSettings } from 'src/app/shared/models/live-settings.model';
import { AvailableScenes } from 'src/app/shared/enums/available-scenes.enum';
import { ScoreType } from 'src/app/shared/enums/score-type.enum';
import { Scene } from 'src/app/shared/models/obs-websocket/scene.model';
import { StreamStatus } from 'src/app/shared/models/obs-websocket/stream-status.model';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {

  private liveSettings: LiveSettings = new LiveSettings({
    bitrate: 6000,
    buffer: 15,
    streamKey: ''
  });

  private alive = true;
  private subscription: Subscription;

  // scences component
  scenes: Scene[] = [];
  scenesLoader = true;
  camerasLoader = false;

  // live status component
  liveUpdateChartData: { value: [string, number] }[] = [];
  streamTime = '00:00:00';
  isStreaming = false;
  replayPlaying = false;

  // frames metrics card
  framesChartData: { value: number; name: string }[] = [
    {
      value: 0,
      name: 'Dropped Frames',
    },
    {
      value: 0,
      name: 'Sent Frames',
    }
  ];

  gameOptions: GameOptions = new GameOptions({
    quarter: 1,
    possession: TeamPossession.HOME,
    flag: false,
    showScoreboard: true
  });

  // teams card
  //// home
  homeTeam: Team = new Team({
    name: 'Nom Equipe Domicile',
    city: 'Ville Equipe Domicile',
    score: 0,
    timeout: 3,
    color: '#133155',
    logo: 'https://placekitten.com/450/450'
  });
  //// away
  awayTeam: Team = new Team({
    name: 'Nom Equipe Exterieur',
    city: 'Ville Equipe Exterieur',
    score: 0,
    timeout: 3,
    color: '#612323',
    logo: 'https://placekitten.com/450/450'
  });

  constructor(
    private obsWebsocket: ObsWebsocketService,
    private toastrService: NbToastrService,
    private electronService: ElectronService
  ) {
    this.getDataFiles().then((data: any) => {
      this.homeTeam = new Team(data.gameSettings.homeTeam);
      this.awayTeam = new Team(data.gameSettings.awayTeam);
      this.gameOptions = new GameOptions(data.gameSettings.options);
    });
    this.obsWebsocket.connect('localhost', 4444, '', false).then(async () => {
      this.toastrService.success(`Successfully connected to OBS`, `Connected`);
      this.subscription = this.obsWebsocket.eventSource$.subscribe(event => this.workOnEvent(event));
      this.loadScenes();
      // this.obsWebsocket.getScore();
      // this.obsWebsocket.getAwayTeamName();
      // this.obsWebsocket.getAwayTeamCityName();
      // this.obsWebsocket.getCurrentQuarter();
      // this.obsWebsocket.getStreamStatus();
      // this.obsWebsocket.setStudioModeOff();
      // this.obsWebsocket.getProfiles();
      // this.obsWebsocket.setScoreBoardVisibility(true);
      // this.obsWebsocket.setFlagVisibility(false);
    }).catch(err => {
      this.toastrService.danger(`${err.message}`, `Error`);
      console.error(err);
    });
  }

  ngOnDestroy() {
    this.alive = false;
    this.subscription.unsubscribe();
    this.obsWebsocket.disconnect();
  }

  async getDataFiles() {
    return new Promise<any>((resolve, reject) => {
      if (this.electronService.isElectronApp) {
        this.electronService.ipcRenderer.once('getDataFilesResponse', (event, arg) => {
          resolve(arg);
        });
        this.electronService.ipcRenderer.send('getDataFiles');
      } else {
        resolve(null);
      }
    });
  }

  workOnEvent(event: any): void {
    // tslint:disable-next-line: no-console
    console.debug(event);
    switch (event['update-type']) {
      case 'SwitchScenes':
        if (this.scenes.find(scene => scene.name === event['scene-name']) !== undefined) {
          this.scenes.find(scene => scene.active).active = false;
          this.scenes.find(scene => scene.name === event['scene-name']).active = true;
        }
        // tslint:disable-next-line: no-string-literal
        // this.scenes.find(scene => scene.name === event['scene-name']).sources = event['sources'];
        // this.activeScene = event['scene-name'];
        break;
      case 'ScenesChanged':
      case 'SceneCollectionChanged':
      case 'SceneCollectionListChanged':
      case 'SwitchTransition':
      case 'TransitionListChanged':
      case 'TransitionDurationChanged':
      case 'ProfileChanged':
      case 'ProfileListChanged':
      case 'ProfileListChanged':
        break;
      case 'SceneItemVisibilityChanged':
        // tslint:disable-next-line: max-line-length
        // this.scenes.find(scene => scene.active).sources.find(source => source.name === event['item-name']).render = event['item-visible'];
        break;
      case 'StreamStatus':
        const streamStatus = new StreamStatus(event);
        console.log(streamStatus);
        // const newData = [];
        this.streamTime = event['stream-timecode'];
        this.liveUpdateChartData.push({
          value: [
            new Date().toISOString(),
            Math.round(streamStatus.cpuUsage),
          ],
        });

        this.framesChartData[0].value = streamStatus.numDroppedFrames;
        this.framesChartData[1].value = streamStatus.numTotalFrames - streamStatus.numDroppedFrames;
        if (this.liveUpdateChartData.length > 50) {
          this.liveUpdateChartData.shift();
        }
        // newData.push({ value: [new Date(), event['cpu-usage']] });
        this.liveUpdateChartData = [...this.liveUpdateChartData];
        this.framesChartData = [...this.framesChartData];
        this.isStreaming = streamStatus.streaming;
        // tslint:disable-next-line: no-string-literal
        // this.isStreaming = event['streaming'];
        // // tslint:disable-next-line: no-string-literal
        // this.isRecording = event['recording'];
        // this.streamLength = event['total-stream-time'];

        // // tslint:disable-next-line: no-string-literal
        // this.fps = event['fps'];
        // this.droppedFrames = event['num-dropped-frames'];
        // this.totalFrames = event['num-total-frames'];
        // // tslint:disable-next-line: no-string-literal
        // this.droppedFramesPercent = event['strain'];
        // this.transmittionSpeed = event['kbits-per-sec'];
        // this.transmittionSpeedB = event['bytes-per-sec'];
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

        // stop replay buffer
        this.obsWebsocket.StartReplayBuffer().catch((err: Error) => { console.error(err); });
        break;

      case 'StreamStopped':
        this.isStreaming = false;
        // reset charts datas
        this.liveUpdateChartData = [];
        this.framesChartData[0].value = 0;
        this.framesChartData[1].value = 0;
        this.framesChartData = [...this.framesChartData];
        // stop replay buffer
        this.obsWebsocket.StopReplayBuffer().catch((err: Error) => { console.error(err); });
        this.obsWebsocket.setCurrentScene(AvailableScenes.STARTING).catch((err: Error) => { console.error(err); });
        break;

      default:
        // tslint:disable-next-line:no-console
        // console.debug(event);
        break;
    }
  }

  loadLastLiveDatas() {

  }

  loadScenes() {
    this.obsWebsocket.getScenesList()
      .then((data: any) => {
        this.scenes = data.scenes.filter((element) => (!element.name.startsWith('*') && !element.name.startsWith('-'))).map(scene => {
          return new Scene(scene);
        });
        if (this.scenes.find(scene => scene.name === data['current-scene']) !== undefined) {
          this.scenes.find(scene => scene.name === data['current-scene']).active = true;
        }
        this.scenesLoader = false;
      }).catch((err: Error) => {
        console.error(err.message);
      });
  }

  changeScene(scene) {
    this.scenesLoader = true;
    this.obsWebsocket.setCurrentScene(scene.name)
      .then(() => {
        const scenes = JSON.parse(JSON.stringify(this.scenes));
        if (scenes.find(element => element.active) !== undefined) {
          scenes.find(element => element.active).active = false;
        }
        if (scenes.find(element => element.name === scene.name) !== undefined) {
          scenes.find(element => element.name === scene.name).active = true;
        }
        this.scenes = scenes;
        this.scenesLoader = false;
      })
      .catch((err: Error) => {
        console.error(err.message);
      });
  }

  changeCamera(camera) {
    this.camerasLoader = true;
    const previousCamera = this.scenes.find(scene => scene.active).sources.find(cam => cam.render);
    this.scenes.find(scene => scene.active).sources.filter(source => source.name.startsWith('- Cam'))
      .find(cam => cam.render).render = false;
    this.obsWebsocket.SetSceneItemProperties(camera.name, { visible: true, 'scene-name': 'Live Scene' })
      .then(() => {
        this.scenes.find(scene => scene.active).sources.find(cam => cam.name === camera.name).render = true;
        const scenes = JSON.parse(JSON.stringify(this.scenes));
        this.obsWebsocket.SetSceneItemProperties(previousCamera.name, { visible: false, 'scene-name': 'Live Scene' });
        this.scenes = scenes;
        this.camerasLoader = false;
      })
      .catch((err: Error) => {
        console.error(err.message);
      });
  }

  changeStreamStatus(event: any) {
    if (this.isStreaming) {
      this.obsWebsocket.StopStreaming()
        .then(() => {
          // tslint:disable-next-line: no-console
          console.debug('Stream stopped');
        }).catch((err: Error) => {
          console.error(err);
        });
    } else {
      this.obsWebsocket.setCurrentScene(AvailableScenes.STARTING)
        .then(() => {
          return this.obsWebsocket.StartStreaming();
        }).then(() => {
          // tslint:disable-next-line:no-console
          console.debug('Stream started');
        }).catch((err: Error) => {
          console.error(err.message);
        });
    }
  }

  // IPC With Electron

  updateTeam(team: Team, isHomeTeam: boolean) {
    if (isHomeTeam) {
      this.homeTeam = Object.assign({}, team);
    } else {
      this.awayTeam = Object.assign({}, team);
    }
    // tslint:disable-next-line: no-unused-expression
    new Promise<any>((resolve, reject) => {
      if (this.electronService.isElectronApp) {
        this.electronService.ipcRenderer.once('updateTeamInfoResponse', (event, arg) => {
          resolve(arg);
        });
        this.electronService.ipcRenderer.send('updateTeamInfo', {
          homeTeam: this.homeTeam,
          awayTeam: this.awayTeam,
          options: this.gameOptions
        });
      } else {
        resolve(null);
      }
    });
  }

  updateGameOptions(options: GameOptions): void {
    this.gameOptions = Object.assign({}, options);
    // tslint:disable-next-line: no-unused-expression
    new Promise<any>((resolve, reject) => {
      if (this.electronService.isElectronApp) {
        this.electronService.ipcRenderer.once('updateGameOptionsResponse', (event, arg) => {
          resolve(arg);
        });
        this.electronService.ipcRenderer.send('updateGameOptions', this.gameOptions);
      } else {
        resolve(null);
      }
    });
  }

  updateImageTeam(file: File, isHomeTeam: boolean) {
    const that = this;
    // tslint:disable-next-line: no-unused-expression
    new Promise<any>((resolve, reject) => {
      if (this.electronService.isElectronApp) {
        this.electronService.ipcRenderer.once('uploadTeamImageResponse', (event, arg: string) => {
          if (isHomeTeam) {
            that.homeTeam.logo = arg;
            that.homeTeam = Object.assign({}, that.homeTeam);
          } else {
            that.awayTeam.logo = arg;
            that.awayTeam = Object.assign({}, that.awayTeam);
          }
          resolve(arg);
        });
        this.electronService.ipcRenderer.send('uploadTeamImage', {
          path: file.path,
          name: file.name,
          isHomeTeam
        });
      } else {
        resolve(null);
      }
    });
  }

  // other Events

  setReplayPlaying(playing: boolean): void {
    if (this.replayPlaying !== playing) {
      if (playing) {
        this.replayPlaying = playing;
        // this.obsWebsocket.SaveReplayBuffer()
        // .then(data => {
        //   // wait 1s for replay video file to be ready
        //   setTimeout(() => {
        //     this.obsWebsocket.setCurrentScene(AvailableScenes.REPLAY).then(data2 => {
        //       setTimeout(() => {
        //         this.obsWebsocket.setCurrentScene(AvailableScenes.LIVE).then(data3 => {
        //           this.replayPlaying = false;
        //         });
        //       }, this.liveSettings.buffer * 1000);
        //     });
        //   }, 1000);
        // }).catch((err: Error) => {
        //   console.error(err.message);
        // });


        // TODO: Delete next timeout - was for test
        this.obsWebsocket.setCurrentScene(AvailableScenes.REPLAY).then(data2 => {
          setTimeout(() => {
            this.obsWebsocket.setCurrentScene(AvailableScenes.LIVE).then(data3 => {
              this.replayPlaying = false;
            });
          }, this.liveSettings.buffer * 1000);
        });
      } else {
        this.obsWebsocket.setCurrentScene(AvailableScenes.LIVE).then(data3 => {
          this.replayPlaying = playing;
        });
      }
    }
  }

  displayScoreAnimation(scoreType: ScoreType): void {
    this.obsWebsocket.SetSceneItemProperties(scoreType, { visible: true, 'scene-name': AvailableScenes.LIVE }).then(data => {
      setTimeout(() => {
        return this.obsWebsocket.SetSceneItemProperties(scoreType, { visible: false, 'scene-name': AvailableScenes.LIVE });
      }, 5000);
    }).catch((err: Error) => {
      console.error(err.message);
    });
  }

}
