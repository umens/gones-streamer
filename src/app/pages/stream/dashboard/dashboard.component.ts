import { Component, OnDestroy } from '@angular/core';
import { ObsWebsocketService } from 'src/app/remote-center/services/obs-websocket.service';
import { Subscription } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { Scene } from 'src/app/shared/models/scene.model';
import { Team } from 'src/app/shared/models/team.model';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {

  private alive = true;
  private subscription: Subscription;

  // scences component
  scenes: any = null;
  scenesLoader = true;
  camerasLoader = false;

  // live status component
  liveUpdateChartData: { value: [string, number] }[] = [];
  streamTime = '00:00:00';
  isStreaming = false;

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

  // teams card
  //// home
  homeTeam: Team = new Team({
    name: 'Home Team',
    city: 'Home Team City',
    score: 0,
    timeout: 3,
    color: '#133155',
    logo: 'https://placekitten.com/450/450',
  });
  //// away
  awayTeam: Team = new Team({
    name: 'Away Team',
    city: 'Away Team City',
    score: 0,
    timeout: 3,
    color: '#612323',
    logo: 'https://placekitten.com/450/450',
  });

  constructor(private obsWebsocket: ObsWebsocketService, private toastrService: NbToastrService) {
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

  workOnEvent(event: any): void {
    // tslint:disable-next-line: no-console
    console.debug(event);
    switch (event['update-type']) {
      case 'SceneItemVisibilityChanged':
        // tslint:disable-next-line: max-line-length
        // this.scenes.find(scene => scene.active).sources.find(source => source.name === event['item-name']).render = event['item-visible'];
        break;
      case 'SwitchScenes':
        // this.scenes.find(scene => scene.active).active = false;
        // this.scenes.find(scene => scene.name === event['scene-name']).active = true;
        // tslint:disable-next-line: no-string-literal
        // this.scenes.find(scene => scene.name === event['scene-name']).sources = event['sources'];
        // this.activeScene = event['scene-name'];
        break;
      case 'StreamStatus':
        // const newData = [];
        this.streamTime = event['stream-timecode'];
        this.liveUpdateChartData.push({
          value: [
            new Date().toISOString(),
            Math.round(event['cpu-usage']),
          ],
        });

        this.framesChartData[0].value = event['num-dropped-frames'];
        this.framesChartData[1].value = event['num-total-frames'] - event['num-dropped-frames'];
        if (this.liveUpdateChartData.length > 50) {
          this.liveUpdateChartData.shift();
        }
        // newData.push({ value: [new Date(), event['cpu-usage']] });
        this.liveUpdateChartData = [...this.liveUpdateChartData];
        this.framesChartData = [...this.framesChartData];
        this.isStreaming = event.streaming;
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
        this.obsWebsocket.setCurrentScene('* First scene').catch((err: Error) => { console.error(err); });
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
        this.scenes = data.scenes.filter((element) => (!element.name.startsWith('*') && !element.name.startsWith('-')));
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

  changeStreamStatus() {
    if (this.isStreaming) {
      this.obsWebsocket.StopStreaming()
        .then(() => {
          // tslint:disable-next-line: no-console
          console.debug('Stream stopped');
        }).catch((err: Error) => {
          console.error(err);
        });
    } else {
      this.obsWebsocket.setCurrentScene('* First scene')
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

  updateTeam(team: Team, isHomeTeam: boolean) {
    if (isHomeTeam) {
      this.homeTeam = team;
    } else {
      this.awayTeam = team;
    }
  }

}
