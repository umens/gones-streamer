import { resolve, join } from 'path';
import { IScene, ITransition} from 'obs-studio-node';
import { NodeObs as osn, SceneFactory, Global, InputFactory, TransitionFactory, ISceneItem, FilterFactory } from 'obs-studio-node';
import { Subject } from 'rxjs';
import type { BrowserWindow } from 'electron';
import { app } from 'electron';
import { v4 as uuid } from 'uuid';
import { screen } from 'electron';
import type { LogFunctions } from 'electron-log';
import { scope } from 'electron-log';
import Store from 'electron-store';

import { Utilities} from '../Utilities';
import { EOBSFilterTypes, EOBSInputTypes, EOBSSettingsCategories, EOBSTransitionTypes, TransitionName } from '../Utilities/models';
import { GetDefaultConfig, StoreType, SceneName, AnimationType } from '../../src/Models';

// When packaged, we need to fix some paths
function fixPathWhenPackaged(p: string) {
  return p.replace('app.asar', 'app.asar.unpacked');
}

class OBSRecorder {

  log: LogFunctions;
  private static _instance: OBSRecorder;
  private utilities: Utilities = new Utilities();

  // private _workingDirectory: string = normalize(osn.wd);
  private _language = 'en-US';
  private _version = '1.0.0';
  private _workingDirectory: string = fixPathWhenPackaged(resolve('node_modules', 'obs-studio-node'));
  private _obsPath: string = fixPathWhenPackaged(this.utilities.paths.osnFolder);

  private _obsInitialized = false;
  private _signals = new Subject();
  private _videoPath =  app.getPath('videos');
  private _host = `obs-studio-node-gones-streamer-${uuid()}`;

  private _scenes: IScene[] = [];
  private _transitions: ITransition[] = [];

  private _os: string;
  private _displayId = 'previewDisplay';

  private _currentScene = SceneName.Starting;
  private _currentCam = 'cam1';
  private _store: Store<StoreType> = new Store<StoreType>({
		defaults: GetDefaultConfig(this.utilities.paths),
  });
  private _perfStatTimer: NodeJS.Timeout | null = null;
  private _mainWin: BrowserWindow | null = null;

  private constructor() {
    this.log = scope('OBS'); 
    this._os = process.platform;
  }

  public get CurrentScene() {
    return this._currentScene;
  }

  public set SetCurrentScene(scene: SceneName) {
    this._currentScene = scene;
  }

  public get CurrentCam() {
    return this._currentCam;
  }

  public set SetCurrentCam(cam: string) {
    this._currentCam = cam;
  }

  public static get Instance()
  {
      // Do you need arguments? Make it a regular static method instead.
      return this._instance || (this._instance = new this());
  }

  /**
   * Init the library, launch OBS Studio instance, configure it, set up sources and scene
   *
   * @memberof OBSRecorder
   */
  initialize = (win: Electron.BrowserWindow | null) => {

    try {
      if (this._obsInitialized) {
        this.log.warn('OBS is already initialized, skipping initialization.');
        return;
      }
    
      this.log.error(this._host);
      this.initOBS();
      this.configureOBS();
      this.setupScenes();
      this.setupTransitions();
      this._obsInitialized = true;
      this._mainWin = win;
    
      this._mainWin?.on('close', () => {
        if (this._perfStatTimer) clearInterval(this._perfStatTimer)
      });
    } catch (error) {
      this.log.error(error);
    }
  };
  
  initOBS = () => {
    let initResult: number;
    this.log.debug('Initializing OBS...');

    try {
      this.log.error(this._host);
      osn.IPC.host(this._host);
      osn.SetWorkingDirectory(this._workingDirectory);
      initResult = osn.OBS_API_initAPI(this._language, this._obsPath, this._version);
    } catch(e) {
      throw Error('Exception when initializing OBS process: ' + e);
    }

    // this.log.log(EVideoCodes.Success);
    if (initResult !== 0) {

      const errorReasons: { [key: string]: string, } = {
        '-2': 'DirectX could not be found on your system. Please install the latest version of DirectX for your machine here <https://www.microsoft.com/en-us/download/details.aspx?id=35?> and try again.',
        '-5': 'Failed to initialize OBS. Your video drivers may be out of date, or Streamlabs OBS may not be supported on your system.',
      };
      const errorMessage = errorReasons[initResult.toString()] || `An unknown error #${initResult} was encountered while initializing OBS.`;

      throw Error('OBS process initialization failed with code ' + errorMessage);
    }  

    osn.OBS_service_connectOutputSignals((signalInfo: unknown) => {
      this._signals.next(signalInfo);
    });

    this.log.debug('OBS initialized');
  };

  configureOBS = () => {
    try {
      this.log.debug('Configuring OBS');

      this.configureOBSGeneral();
      this.configureOBSStream();
      this.configureOBSOutput();
      this.configureOBSAudio();
      this.configureOBSVideo();

      this.log.debug('OBS Configured');
    } catch (error) {
      this.log.error(error);
    }  
  };
  
  configureOBSGeneral = () => {
    //
  };

  configureOBSStream = () => {    
    this.setSetting(EOBSSettingsCategories.Stream, 'service', 'YouTube - RTMPS');
  };
  
  configureOBSOutput = () => {
    this.setSetting(EOBSSettingsCategories.Output, 'Mode', 'Simple');
    this.setSetting(EOBSSettingsCategories.Output, 'VBitrate', '6000');
    const availableStreamEncoders = this.getAvailableValues(EOBSSettingsCategories.Output, 'Streaming', 'StreamEncoder');
    this.setSetting(EOBSSettingsCategories.Output, 'StreamEncoder', availableStreamEncoders.slice(-1)[0] || 'x264');
    this.setSetting(EOBSSettingsCategories.Output, 'ABitrate', '160');
    // const availableEncoders = this.getAvailableValues(EOBSSettingsCategories.Output, 'Recording', 'RecEncoder');
    // this.setSetting(EOBSSettingsCategories.Output, 'RecEncoder', 'x264');
    // this.setSetting(EOBSSettingsCategories.Output, 'RecFilePath', app.getPath('videos'));
    // this.setSetting(EOBSSettingsCategories.Output, 'RecFormat', 'mkv');
  };

  configureOBSAudio = () => {
    this.setSetting(EOBSSettingsCategories.Audio, 'SampleRate', 48000);
    this.setSetting(EOBSSettingsCategories.Audio, 'ChannelSetup', 'Stereo');
  };
  
  configureOBSVideo = () => {
    this.setSetting(EOBSSettingsCategories.Video, 'Base', '1920x1080');
    this.setSetting(EOBSSettingsCategories.Video, 'Output', '1920x1080');
    this.setSetting(EOBSSettingsCategories.Video, 'FPSCommon', 30);
  };

  setupScenes = () => {

    try {

      let source, sceneItem, filterChroma;
      Object.values(SceneName).forEach(name => {
        // Creating scene
        const scene = SceneFactory.create(name);

        switch (name) {

          case SceneName.Background: {
            source = InputFactory.create(
              EOBSInputTypes.ImageSource, 
              'bg_image', 
              {
                unload: true,
                file: this._store.get('BackgroundImage'),
              },
            );
            sceneItem = scene.add(source);
            sceneItem.position = { x: 0, y: 0 };
            
            source = InputFactory.create(
              EOBSInputTypes.ImageSource, 
              'away_logo', 
              {
                unload: true,
                file: this._store.get('GameStatut.AwayTeam.logo'),
              },
            );
            sceneItem = scene.add(source);
            sceneItem.position = { x: 1265, y: 365 };

            source = InputFactory.create(
              EOBSInputTypes.TextGDI, 
              'away_city_text', 
              {
                'align': 'center',
                'extents': true,
                'extents_cx': 960,
                'extents_cy': 100,
                'font': {
                  'face': 'Impact',
                  'flags': 0,
                  'size': 72,
                  'style': 'Normal',
                },
                'text': this._store.get('GameStatut.AwayTeam.city'),
                'valign': 'center',
              },
            );
            sceneItem = scene.add(source);
            sceneItem.position = { x: 960, y: 815 };

            source = InputFactory.create(
              EOBSInputTypes.TextGDI, 
              'away_name_text', 
              {
                'align': 'center',
                'extents': true,
                'extents_cx': 960,
                'extents_cy': 100,
                'font': {
                  'face': 'Impact',
                  'flags': 0,
                  'size': 90,
                  'style': 'Normal',
                },
                'text': this._store.get('GameStatut.AwayTeam.name'),
                'valign': 'center',
              },
            );
            sceneItem = scene.add(source);
            sceneItem.position = { x: 960, y: 715 };

            source = InputFactory.create(
              EOBSInputTypes.ImageSource, 
              'home_logo', 
              {
                unload: true,
                file: this._store.get('GameStatut.HomeTeam.logo'),
              },
            );
            sceneItem = scene.add(source);
            sceneItem.position = { x: 305, y: 365 };

            source = InputFactory.create(
              EOBSInputTypes.TextGDI, 
              'home_city_text', 
              {
                'align': 'center',
                'extents': true,
                'extents_cx': 960,
                'extents_cy': 100,
                'font': {
                  'face': 'Impact',
                  'flags': 0,
                  'size': 72,
                  'style': 'Normal',
                },
                'text': this._store.get('GameStatut.HomeTeam.city'),
                'valign': 'center',
              },
            );
            sceneItem = scene.add(source);
            sceneItem.position = { x: 0, y: 815 };

            source = InputFactory.create(
              EOBSInputTypes.TextGDI, 
              'home_name_text', 
              {
                'align': 'center',
                'extents': true,
                'extents_cx': 960,
                'extents_cy': 100,
                'font': {
                  'face': 'Impact',
                  'flags': 0,
                  'size': 90,
                  'style': 'Normal',
                },
                'text': this._store.get('GameStatut.HomeTeam.name'),
                'valign': 'center',
              },
            );
            sceneItem = scene.add(source);
            sceneItem.position = { x: 0, y: 715 };

            break;
          }

          case SceneName.ScoreBackground: {
            source = InputFactory.create(
              EOBSInputTypes.TextGDI, 
              'score-separator-text', 
              {
                'align': 'center',
                'extents': true,
                'extents_cx': 1920,
                'extents_cy': 100,
                'extents_wrap': true,
                'font': {
                  'face': 'Impact',
                  'flags': 0,
                  'size': 150,
                  'style': 'Normal',
                },
                'text': '-',
                'valign': 'center',
              },
            );
            sceneItem = scene.add(source);
            sceneItem.position = { x: 0, y: 490 };
            
            source = InputFactory.create(
              EOBSInputTypes.TextGDI, 
              'away-score-text', 
              {
                'align': 'left',
                'extents': true,
                'extents_cx': 960,
                'extents_cy': 200,
                'extents_wrap': true,
                'font': {
                  'face': 'Impact',
                  'flags': 0,
                  'size': 150,
                  'style': 'Normal',
                },
                'text': `${this._store.get('GameStatut.AwayTeam.score')}`.padStart(2, '0'),
                'valign': 'center',
              },
            );
            sceneItem = scene.add(source);
            sceneItem.position = { x: 970, y: 440 };

            source = InputFactory.create(
              EOBSInputTypes.TextGDI, 
              'home-score-text', 
              {
                'align': 'right',
                'extents': true,
                'extents_cx': 950,
                'extents_cy': 200,
                'extents_wrap': true,
                'font': {
                  'face': 'Impact',
                  'flags': 0,
                  'size': 150,
                  'style': 'Normal',
                },
                'text': `${this._store.get('GameStatut.HomeTeam.score')}`.padStart(2, '0'),
                'valign': 'center',
              },
            );
            sceneItem = scene.add(source);
            sceneItem.position = { x: 0, y: 440 };
            break;
          }

          //TODO:
          case SceneName.SponsorsMedia: {

            source = InputFactory.create(
              EOBSInputTypes.ImageSource, 
              'sponsor-image', 
              {
                unload: true,
                file: '',
                cx: 1920,
                cy: 1080,
              },
            );
            sceneItem = scene.add(source);
            sceneItem.bounds = { x: 1920, y: 1080 };
            sceneItem.visible = true;

            source = InputFactory.create(
              EOBSInputTypes.FFMPEGSource, 
              'sponsor-video', 
              {
                'close_when_inactive': true,
                'file': '',
                'is_local_file': true,
                'local_file': '',
                'render': true,
                cx: 1920,
                cy: 1080,
              },
            );
            sceneItem = scene.add(source);
            sceneItem.bounds = { x: 1920, y: 1080 };
            sceneItem.visible = false;
            break;
          }

          case SceneName.Soundboard: {

            source = InputFactory.create(
              EOBSInputTypes.WASAPIOutput, 
              'audio-live', 
              {
                // unload: false,
                // file: join(this.utilities.paths.appFolder, './logo.png'),
              },
            );
            sceneItem = scene.add(source);
            break;
          }

          case SceneName.Starting: {

            const bgScene = SceneFactory.fromName(SceneName.Background);
            sceneItem = scene.add(bgScene.source);

            source = InputFactory.create(
              EOBSInputTypes.TextGDI, 
              'week-text', 
              {
                'align': 'center',
                'extents': true,
                'extents_cx': 1920,
                'extents_cy': 100,
                'font': {
                  'face': 'Impact',
                  'flags': 0,
                  'size': 100,
                  'style': 'Normal',
                },
                'text': `${this._store.get('GameStatut.Options.competition')} - ${this._store.get('GameStatut.Options.journee')}`,
                'valign': 'center',
              },
            );
            sceneItem = scene.add(source);
            sceneItem.position = { x: 0, y: 230 };

            source = InputFactory.create(
              EOBSInputTypes.TextGDI, 
              'coming-soon-text', 
              {
                'align': 'center',
                'extents': true,
                'extents_cx': 1920,
                'extents_cy': 350,
                'font': {
                  'face': 'Impact',
                  'flags': 0,
                  'size': 150,
                  'style': 'Normal',
                },
                'text': 'Game Day',
                'valign': 'center',
              },
            );
            sceneItem = scene.add(source);
            sceneItem.position = { x: 0, y: 0 };
            break;
          }

          case SceneName.Halftime: {

            const bgScene = SceneFactory.fromName(SceneName.Background);
            sceneItem = scene.add(bgScene.source);

            const bgScoreScene = SceneFactory.fromName(SceneName.ScoreBackground);
            sceneItem = scene.add(bgScoreScene.source);

            source = InputFactory.create(
              EOBSInputTypes.TextGDI, 
              'halftime-text', 
              {
                'align': 'center',
                'extents': true,
                'extents_cx': 1920,
                'extents_cy': 350,
                'font': {
                  'face': 'Impact',
                  'flags': 0,
                  'size': 150,
                  'style': 'Normal',
                },
                'text': 'Halftime',
                'valign': 'center',
              },
            );
            sceneItem = scene.add(source);
            sceneItem.position = { x: 0, y: 0 };
            break;
          }

          case SceneName.Ending: {

            const bgScene = SceneFactory.fromName(SceneName.Background);
            sceneItem = scene.add(bgScene.source);

            const bgScoreScene = SceneFactory.fromName(SceneName.ScoreBackground);
            sceneItem = scene.add(bgScoreScene.source);

            source = InputFactory.create(
              EOBSInputTypes.TextGDI, 
              'ending-text', 
              {
                'align': 'center',
                'extents': true,
                'extents_cx': 1920,
                'extents_cy': 350,
                'font': {
                  'face': 'Impact',
                  'flags': 0,
                  'size': 150,
                  'style': 'Normal',
                },
                'text': 'Fin du match',
                'valign': 'center',
              },
            );
            sceneItem = scene.add(source);
            sceneItem.position = { x: 0, y: 0 };
            break;
          }

          case SceneName.Live: {

            const soundScene = SceneFactory.fromName(SceneName.Soundboard);
            sceneItem = scene.add(soundScene.source);            

            // const camname = this.getCameraSource();
            source = InputFactory.create(
              EOBSInputTypes.DShowInputReplay, 
              'cam1', 
              {
                'active': true,
                'audio_device_id': 'Microphone interne (Conexant ISST Audio):',
                'deactivate_when_not_showing': false,
                'directory': join(this.utilities.paths.appFolder, './'),
                'duration': 10000,
                'end_action': 0,
                'file_format': '%CCYY-%MM-%DD %hh.%mm.%ss',
                'last_video_device_id': 'GoPro Webcam:',
                'load_switch_scene': SceneName.Replay,
                'next_scene': SceneName.Live,
                'sound_trigger': false,
                'source': 'cam1',
                'use_custom_audio_device': false,
                'video_device_id': 'GoPro Webcam:',
                'visibility_action': 0,
              },
            );
            for (let i = 1; i <= 4; i++) {
              if (source.width === 0) {
                const waitMs = 100 * i;
                console.debug(`Waiting for ${waitMs}ms until camera get initialized.`);
                this.busySleep(waitMs); // We can't use async/await here
              }
            }
            // const settings = source.settings;
            // console.debug('Camera settings:', source.settings);
            // settings['width'] = 1920;
            // settings['height'] = 1080;
            // source.update(settings);
            // source.save();
            sceneItem = scene.add(source);
            sceneItem.visible = this._currentCam === 'cam1' ? true : false;
            // sceneItem.boundsType = 2;
            sceneItem.boundsAlignment = 0;
            sceneItem.alignment = 5;
            // sceneItem.alignment = EAlignment.TopLeft;
            // sceneItem.bounds = { x: 1920, y: 1080 };            

            // if (isDev) {
            //   this.window.loadURL('http://localhost:3000/index.html#/scoreboard');
            // } else {
            //   // 'build/index.html'
            //   this.window.removeMenu();
            //   this.window.loadURL(`file://${__dirname}/index.html#/scoreboard`);
            //   // this.window.loadURL(url.format({
            //   //   pathname: `${__dirname}/index.html#/scoreboard`,
            //   //   protocol: 'file:',
            //   //   slashes: true
            //   // }));
            // }
            // source = InputFactory.create(
            //   EOBSInputTypes.BrowserSource,
            //   'scoreboard', 
            //   {
            //     fps: 60,
            //     "fps_custom": true,
            //     "height": 100,
            //     "is_local_file": false,
            //     "reroute_audio": false,
            //     "restart_when_active": false,
            //     "shutdown": false,
            //     "url": "http://localhost:3000/index.html#/scoreboard",
            //     "webpage_control_level": 0,
            //     "width": 1000
            //   },
            // );

            // source = InputFactory.create(
            //   EOBSInputTypes.ImageSource, 
            //   'scoreboard', 
            //   {
            //     unload: false,
            //     file: join(this.utilities.paths.appFolder, './scoreboard.png'),
            //   },
            // );
            source = InputFactory.create(
              EOBSInputTypes.WindowCapture, 
              'scoreboard', 
              {
                'client_area': true,
                'compatibility': false,
                'cursor': false,
                'method': 0,
                'priority': 1,
                'window': 'Gones Streamer - Scoreboard:Chrome_WidgetWin_1:electron.exe',
              },
            );
            filterChroma = FilterFactory.create(
              EOBSFilterTypes.ChromaKey, 
              'incrustation',
              {
                // 'key_color_type': 'magenta',
              },
            );
            source.addFilter(filterChroma);
            sceneItem = scene.add(source);
            sceneItem.visible = true;
            sceneItem.position = { x: 920, y: 0 };

            // animations
            const animationsSources: ISceneItem[] = [];
            source = InputFactory.create(
              EOBSInputTypes.FFMPEGSource, 
              AnimationType.TIMEOUT, 
              {
                'local_file': join(this.utilities.paths.appFolder, './timeout.webm'),
              },
            );
            sceneItem = scene.add(source);
            sceneItem.visible = false;
            animationsSources.push(sceneItem);
            
            source = InputFactory.create(
              EOBSInputTypes.FFMPEGSource, 
              AnimationType.FIELDGOAL, 
              {
                'local_file': join(this.utilities.paths.appFolder, './fieldgoal_animation.mov'),
              },
            );
            filterChroma = FilterFactory.create(
              EOBSFilterTypes.ChromaKey, 
              'incrustation',
              {
                'key_color_type': 'magenta',
              },
            );
            source.addFilter(filterChroma);
            sceneItem = scene.add(source);
            sceneItem.visible = false;
            sceneItem.bounds = { x: 1920, y: 1080 };
            // sceneItem.boundsType = 1;
            animationsSources.push(sceneItem);
            
            source = InputFactory.create(
              EOBSInputTypes.FFMPEGSource, 
              AnimationType.SAFETY, 
              {
                'local_file': '',//join(this.utilities.paths.appFolder, './fieldgoal_animation.mov'),
              },
            );
            filterChroma = FilterFactory.create(
              EOBSFilterTypes.ChromaKey, 
              'incrustation',
              {
                'key_color_type': 'magenta',
              },
            );
            source.addFilter(filterChroma);
            sceneItem = scene.add(source);
            sceneItem.visible = false;
            sceneItem.bounds = { x: 1920, y: 1080 };
            animationsSources.push(sceneItem);
            
            source = InputFactory.create(
              EOBSInputTypes.FFMPEGSource, 
              AnimationType.EXTRAPOINT, 
              {
                'local_file': join(this.utilities.paths.appFolder, './extrapoint_animation.mov'),
              },
            );
            filterChroma = FilterFactory.create(
              EOBSFilterTypes.ChromaKey, 
              'incrustation',
              {
                'key_color_type': 'magenta',
              },
            );
            source.addFilter(filterChroma);
            sceneItem = scene.add(source);
            sceneItem.visible = false;
            sceneItem.bounds = { x: 1920, y: 1080 };
            animationsSources.push(sceneItem);
            
            source = InputFactory.create(
              EOBSInputTypes.FFMPEGSource, 
              AnimationType.PAT, 
              {
                'local_file': join(this.utilities.paths.appFolder, './pat_animation.mov'),
              },
            );
            filterChroma = FilterFactory.create(
              EOBSFilterTypes.ChromaKey, 
              'incrustation',
              {
                'key_color_type': 'magenta',
              },
            );
            source.addFilter(filterChroma);
            sceneItem = scene.add(source);
            sceneItem.visible = false;
            sceneItem.bounds = { x: 1920, y: 1080 };
            animationsSources.push(sceneItem);
            
            source = InputFactory.create(
              EOBSInputTypes.FFMPEGSource, 
              AnimationType.TOUCHDOWN, 
              {
                'local_file': join(this.utilities.paths.appFolder, './touchdown_animation.mov'),
              },
            );
            filterChroma = FilterFactory.create(
              EOBSFilterTypes.ChromaKey, 
              'incrustation',
              {
                'key_color_type': 'magenta',
              },
            );
            source.addFilter(filterChroma);
            sceneItem = scene.add(source);
            sceneItem.visible = false;
            sceneItem.bounds = { x: 1920, y: 1080 }; 
            animationsSources.push(sceneItem);           
            
            //folder
            source = InputFactory.create(
              EOBSInputTypes.Group, 
              'animations', 
              {
                "custom_size": true,
                "cx": 1920,
                "cy": 1080,
                'items': animationsSources
              },
            );
            sceneItem = scene.add(source);
            sceneItem.bounds = { x: 1920, y: 1080 };
            
            break;
          }

          case SceneName.Replay: {

            const soundScene = SceneFactory.fromName(SceneName.Soundboard);
            sceneItem = scene.add(soundScene.source);

            source = InputFactory.create(
              EOBSInputTypes.TextGDI, 
              'replay-text', 
              {
                'align': 'center',
                'bk_opacity': 50,
                'chatlog': false,
                'extents': false,
                'extents_cx': 500,
                'extents_cy': 175,
                'extents_wrap': true,
                'font': {
                    'face': 'Impact',
                    'flags': 0,
                    'size': 120,
                    'style': 'Normal',
                },
                'outline': false,
                'text': ' Replay ',
                'transform': 0,
                'valign': 'center',
              },
            );
            sceneItem = scene.add(source);
            sceneItem.position = { x: 1522, y: 895 };
            
            source = InputFactory.create(
              EOBSInputTypes.ReplaySource, 
              'replay-video', 
              {
                'directory': join(this.utilities.paths.appFolder, './'),
                'duration': 10000,
                'end_action': 0,
                'file_format': '%CCYY-%MM-%DD %hh.%mm.%ss',
                'load_switch_scene': SceneName.Replay,
                'next_scene': SceneName.Live,
                'source': 'cam1',
                'visibility_action': 0,
              },
              {
                'ReplaySource.Replay': [
                  {
                      'key': 'OBS_KEY_F10',
                  },
                ],
              },
            );
            sceneItem = scene.add(source);
            sceneItem.visible = this._currentCam === 'cam1' ? true : false;

            break;
          }

          // case SceneName.Sponsors: {

          //   //full sponsor
          //   const sponsorMediaScene = SceneFactory.fromName(SceneName.SponsorsMedia);
          //   sceneItem = scene.add(sponsorMediaScene.source);
            
          //   //folder full
          //   source = InputFactory.create(
          //     EOBSInputTypes.Group, 
          //     'full_sponsor', 
          //     {
          //       "custom_size": true,
          //       "cx": 1920,
          //       "cy": 1080,
          //       'items': [sceneItem]
          //     },
          //   );
          //   sceneItem = scene.add(source);
          //   sceneItem.bounds = { x: 1920, y: 1080 };
          //   sceneItem.visible = false;

          //   //big_sponsor
          //   const bigSources: ISceneItem[] = [];
          //   source = InputFactory.create(
          //     EOBSInputTypes.FFMPEGSource, 
          //     'background_big', 
          //     {
          //       'clear_on_media_end': false,
          //       'local_file': join(this.utilities.paths.appFolder, './sponsor_background.mp4'),
          //       'looping': true,
          //       'restart_on_activate': true,
          //     },
          //   );
          //   sceneItem = scene.add(source);
          //   bigSources.push(sceneItem);

          //   sceneItem = scene.add(sponsorMediaScene.source);
          //   sceneItem.position = { x: 117.59999847412109, y: 272.5 };
          //   sceneItem.scale = { x: 0.49531251192092896, y: 0.49537035822868347 };
          //   bigSources.push(sceneItem);

          //   const startingScene = SceneFactory.fromName(SceneName.Starting);
          //   sceneItem = scene.add(startingScene.source);
          //   sceneItem.position = { x: 1166.0, y: 358.5 };
          //   sceneItem.scale = { x: 0.33645832538604736, y: 0.33611109852790833 };
          //   sceneItem.visible = false;
          //   bigSources.push(sceneItem);

          //   const halftimeScene = SceneFactory.fromName(SceneName.Halftime);
          //   sceneItem = scene.add(halftimeScene.source);
          //   sceneItem.position = { x: 1166.0, y: 358.5 };
          //   sceneItem.scale = { x: 0.33645832538604736, y: 0.33611109852790833 };
          //   sceneItem.visible = true;
          //   bigSources.push(sceneItem);

          //   const endingScene = SceneFactory.fromName(SceneName.Ending);
          //   sceneItem = scene.add(endingScene.source);
          //   sceneItem.position = { x: 1166.0, y: 358.5 };
          //   sceneItem.scale = { x: 0.33645832538604736, y: 0.33611109852790833 };
          //   sceneItem.visible = false;
          //   bigSources.push(sceneItem);

          //   const liveScene = SceneFactory.fromName(SceneName.Live);
          //   sceneItem = scene.add(liveScene.source);
          //   sceneItem.position = { x: 1166.0, y: 358.5 };
          //   sceneItem.scale = { x: 0.33645832538604736, y: 0.33611109852790833 };
          //   sceneItem.visible = false;
          //   bigSources.push(sceneItem);
            
          //   //folder big
          //   source = InputFactory.create(
          //     EOBSInputTypes.Group, 
          //     'full_sponsor', 
          //     {
          //       "custom_size": true,
          //       "cx": 1920,
          //       "cy": 1080,
          //       'items': bigSources
          //     },
          //   );
          //   sceneItem = scene.add(source);
          //   sceneItem.bounds = { x: 1920, y: 1080 };
          //   sceneItem.visible = true;

          //   //small sponsor
          //   const smallSources: ISceneItem[] = [];
          //   source = InputFactory.create(
          //     EOBSInputTypes.FFMPEGSource, 
          //     'background_small', 
          //     {
          //       'clear_on_media_end': false,
          //       'local_file': join(this.utilities.paths.appFolder, './sponsor_background.mp4'),
          //       'looping': true,
          //       'restart_on_activate': true,
          //     },
          //   );
          //   sceneItem = scene.add(source);
          //   smallSources.push(sceneItem);

          //   sceneItem = scene.add(sponsorMediaScene.source);
          //   sceneItem.position = { x: 1166.0, y: 358.5 };
          //   sceneItem.scale = { x: 0.33645832538604736, y: 0.33611109852790833 };
          //   smallSources.push(sceneItem);

          //   sceneItem = scene.add(startingScene.source);
          //   sceneItem.position = { x: 117.59999847412109, y: 272.5 };
          //   sceneItem.scale = { x: 0.49531251192092896, y: 0.49537035822868347 };
          //   sceneItem.visible = false;
          //   smallSources.push(sceneItem);

          //   sceneItem = scene.add(halftimeScene.source);
          //   sceneItem.position = { x: 117.59999847412109, y: 272.5 };
          //   sceneItem.scale = { x: 0.49531251192092896, y: 0.49537035822868347 };
          //   sceneItem.visible = true;
          //   smallSources.push(sceneItem);

          //   sceneItem = scene.add(endingScene.source);
          //   sceneItem.position = { x: 117.59999847412109, y: 272.5 };
          //   sceneItem.scale = { x: 0.49531251192092896, y: 0.49537035822868347 };
          //   sceneItem.visible = false;
          //   smallSources.push(sceneItem);

          //   sceneItem = scene.add(liveScene.source);
          //   sceneItem.position = { x: 117.59999847412109, y: 272.5 };
          //   sceneItem.scale = { x: 0.49531251192092896, y: 0.49537035822868347 };
          //   sceneItem.visible = false;
          //   smallSources.push(sceneItem);
            
          //   //folder small
          //   source = InputFactory.create(
          //     EOBSInputTypes.Group, 
          //     'small_sponsor', 
          //     {
          //       "custom_size": true,
          //       "cx": 1920,
          //       "cy": 1080,
          //       'items': smallSources
          //     },
          //   );
          //   sceneItem = scene.add(source);
          //   sceneItem.bounds = { x: 1920, y: 1080 };
          //   sceneItem.visible = false;
          //   break;
          // }

          case SceneName.SponsorsFull: {
            const bgScene = SceneFactory.fromName(SceneName.SponsorsMedia);
            sceneItem = scene.add(bgScene.source);
            break;
          }

          case SceneName.SponsorsBig: {

            source = InputFactory.create(
              EOBSInputTypes.FFMPEGSource, 
              'background_big', 
              {
                'clear_on_media_end': false,
                'local_file': join(this.utilities.paths.appFolder, './sponsor_background.mp4'),
                'looping': true,
                'restart_on_activate': true,
              },
            );
            sceneItem = scene.add(source);

            const sponsorMediaScene = SceneFactory.fromName(SceneName.SponsorsMedia);
            sceneItem = scene.add(sponsorMediaScene.source);
            sceneItem.position = { x: 117.59999847412109, y: 272.5 };
            sceneItem.scale = { x: 0.49531251192092896, y: 0.49537035822868347 };

            const startingScene = SceneFactory.fromName(SceneName.Starting);
            sceneItem = scene.add(startingScene.source);
            sceneItem.position = { x: 1166.0, y: 358.5 };
            sceneItem.scale = { x: 0.33645832538604736, y: 0.33611109852790833 };
            sceneItem.visible = false;

            const halftimeScene = SceneFactory.fromName(SceneName.Halftime);
            sceneItem = scene.add(halftimeScene.source);
            sceneItem.position = { x: 1166.0, y: 358.5 };
            sceneItem.scale = { x: 0.33645832538604736, y: 0.33611109852790833 };
            sceneItem.visible = false;

            const endingScene = SceneFactory.fromName(SceneName.Ending);
            sceneItem = scene.add(endingScene.source);
            sceneItem.position = { x: 1166.0, y: 358.5 };
            sceneItem.scale = { x: 0.33645832538604736, y: 0.33611109852790833 };
            sceneItem.visible = false;

            const liveScene = SceneFactory.fromName(SceneName.Live);
            sceneItem = scene.add(liveScene.source);
            sceneItem.position = { x: 1166.0, y: 358.5 };
            sceneItem.scale = { x: 0.33645832538604736, y: 0.33611109852790833 };
            sceneItem.visible = false;

            break;
          }

          case SceneName.SponsorsSmall: {

            source = InputFactory.create(
              EOBSInputTypes.FFMPEGSource, 
              'background_small', 
              {
                'clear_on_media_end': false,
                'local_file': join(this.utilities.paths.appFolder, './sponsor_background.mp4'),
                'looping': true,
                'restart_on_activate': true,
              },
            );
            sceneItem = scene.add(source);

            const sponsorMediaScene = SceneFactory.fromName(SceneName.SponsorsMedia);
            sceneItem = scene.add(sponsorMediaScene.source);
            sceneItem.position = { x: 1166.0, y: 358.5 };
            sceneItem.scale = { x: 0.33645832538604736, y: 0.33611109852790833 };

            const startingScene = SceneFactory.fromName(SceneName.Starting);
            sceneItem = scene.add(startingScene.source);
            sceneItem.position = { x: 117.59999847412109, y: 272.5 };
            sceneItem.scale = { x: 0.49531251192092896, y: 0.49537035822868347 };
            sceneItem.visible = false;

            const halftimeScene = SceneFactory.fromName(SceneName.Halftime);
            sceneItem = scene.add(halftimeScene.source);
            sceneItem.position = { x: 117.59999847412109, y: 272.5 };
            sceneItem.scale = { x: 0.49531251192092896, y: 0.49537035822868347 };
            sceneItem.visible = false;

            const endingScene = SceneFactory.fromName(SceneName.Ending);
            sceneItem = scene.add(endingScene.source);
            sceneItem.position = { x: 117.59999847412109, y: 272.5 };
            sceneItem.scale = { x: 0.49531251192092896, y: 0.49537035822868347 };
            sceneItem.visible = false;

            const liveScene = SceneFactory.fromName(SceneName.Live);
            sceneItem = scene.add(liveScene.source);
            sceneItem.position = { x: 117.59999847412109, y: 272.5 };
            sceneItem.scale = { x: 0.49531251192092896, y: 0.49537035822868347 };
            sceneItem.visible = false;

            break;
          }
        
          default:
            break;
        }
      });

      this.changeActiveScene(this._currentScene);
      
    } catch (error) {
      this.log.error(error);
    }
    
  };
  
  setupTransitions = () => {
    
    const cut = TransitionFactory.create(EOBSTransitionTypes.Cut, TransitionName.Cut);
    this._transitions.push(cut);
    Global.setOutputSource(0, cut);
    // osn.

    const stingerReplay = TransitionFactory.create(
      EOBSTransitionTypes.Stinger, 
      TransitionName.Replay, 
      {
        'audio_monitoring': 2,
        'path': join(this.utilities.paths.appFolder, './stinger_replay.webm'),
        'transition_point': 1000,
      },
    );
    this._transitions.push(stingerReplay);
    
    const stingerLive = TransitionFactory.create(
      EOBSTransitionTypes.Stinger, 
      TransitionName.Live, 
      {
        'audio_monitoring': 2,
        'path': join(this.utilities.paths.appFolder, './stinger_live.webm'),
        'transition_point': 1000,
      },
    );
    this._transitions.push(stingerLive);
  };

  // getCameraSource = () => {
  //   console.debug('Trying to set up web camera...')
  
  //   // Setup input without initializing any device just to get list of available ones
  //   const dummyInput = 
  //       InputFactory.create('dshow_input', 'video', {
  //         audio_device_id: 'does_not_exist',
  //         video_device_id: 'does_not_exist',
  //       });
  
  //   const cameraItems = (dummyInput.properties.get('video_device_id') as any).details.items;
  //   console.debug(cameraItems.length)
  //   console.debug(cameraItems)
  
  //   dummyInput.release();
  
  //   if (cameraItems.length === 0) {
  //     console.debug('No camera found!!')
  //     return null;
  //   }

  //   cameraItems.forEach((cameraItem: any, i: any) => {
  //     const deviceId = cameraItem.value;
  //     cameraItem.selected = true;
  //     console.debug(`cameraItem[${i}].name: ` + cameraItem.name);
  //   });
  
  //   const deviceId = cameraItems[0].value;
  //   cameraItems[0].selected = true;
  //   console.debug('cameraItems[0].name: ' + cameraItems[0].name);
  
  //   // const obsCameraInput = InputFactory.create('dshow_input', 'video', {
  //   //       video_device_id: deviceId,
  //   //     });
  
  //   // // It's a hack to wait a bit until device become initialized (maximum for 1 second)
  //   // // If you know proper way how to determine whether camera is working and how to subscribe for any events from it, create a pull request
  //   // // See discussion at https://github.com/Envek/obs-studio-node-example/issues/10
  //   // for (let i = 1; i <= 4; i++) {
  //   //   if (obsCameraInput.width === 0) {
  //   //     const waitMs = 100 * i;
  //   //     console.debug(`Waiting for ${waitMs}ms until camera get initialized.`);
  //   //     this.busySleep(waitMs); // We can't use async/await here
  //   //   }
  //   // }
  
  //   // if (obsCameraInput.width === 0) {
  //   //   console.debug(`Found camera "${cameraItems[0].name}" doesn't seem to work as its reported width is still zero.`);
  //   //   return null;
  //   // }
  
  //   // Way to update settings if needed:
  //   // let settings = obsCameraInput.settings;
  //   // console.debug('Camera settings:', obsCameraInput.settings);
  //   // settings['width'] = 320;
  //   // settings['height'] = 240;
  //   // obsCameraInput.update(settings);
  //   // obsCameraInput.save();
  
  //   // return obsCameraInput;
  //   return deviceId;
  // };

  busySleep = (sleepDuration: number) => {
    const now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration) { /* do nothing */ }
  };

  shutdown = () => {
    if (!this._obsInitialized) {
      this.log.debug('OBS is already shut down!');
      return false;
    }
  
    this.log.debug('Shutting down OBS...');
  
    try {
      this.removePreview();
      osn.OBS_service_removeCallback();
      osn.IPC.disconnect();
      this._obsInitialized = false;
    } catch(e) {
      throw Error('Exception when shutting down OBS process' + e);
    }
  
    this.log.debug('OBS shutdown successfully');
  
    return true;
  };

  setSetting = (category: string, parameter: string, value: string | number | undefined) => {
    let oldValue;
  
    // Getting settings container
    const settings = osn.OBS_settings_getSettings(category).data;
  
    settings.forEach((subCategory: { parameters: any[]; }): void => {
      subCategory.parameters.forEach((param: { name: any; currentValue: any; }) => {
        if (param.name === parameter) {
          oldValue = param.currentValue;
          param.currentValue = value;
        }
      });
    });
  
    // Saving updated settings container
    if (value !== oldValue) {
      osn.OBS_settings_saveSettings(category, settings);
    }
  };  
  
  getSetting = (category: string, subcategory: string, parameter: string | number | undefined) => {  
    // Getting settings container
    const settings = osn.OBS_settings_getSettings(category).data;
    
    let subcategorySettings: any = settings.filter((sub: { nameSubCategory: string; }) => sub.nameSubCategory === subcategory);
    if (!subcategorySettings) {
      throw new Error(`There is no subcategory ${subcategory} for OBS settings category ${category}`);
    } else if(subcategorySettings.length > 1) {
      subcategorySettings = Array.prototype.concat(...subcategorySettings.map((a: any) => { return a.parameters; }));
      subcategorySettings = { nameSubCategory: `${subcategory}`, parameters: subcategorySettings };
    }

    const parameterSettings = subcategorySettings.parameters.find((param: { name: string; }) => param.name === parameter);
    if (!parameterSettings) {
      throw new Error(`There is no parameter ${parameter} for OBS settings category ${category}.${subcategory}`);
    }

    return parameterSettings.currentValue;
  };  
  
  getAvailableValues = (category: string, subcategory: string, parameter: string) => {
    const categorySettings = osn.OBS_settings_getSettings(category).data;
    if (!categorySettings) {
      this.log.warn(`There is no category ${category} in OBS settings`);
      return [];
    }
  
    let subcategorySettings: any = categorySettings.filter((sub: { nameSubCategory: string; }) => sub.nameSubCategory === subcategory);
    if (!subcategorySettings) {
      this.log.warn(`There is no subcategory ${subcategory} for OBS settings category ${category}`);
      return [];
    } else if(subcategorySettings.length > 1) {
      subcategorySettings = Array.prototype.concat(...subcategorySettings.map((a: any) => { return a.parameters; }));
      subcategorySettings = { nameSubCategory: `${subcategory}`, parameters: subcategorySettings };
    }
    else {
      subcategorySettings = subcategorySettings[0];
    }
  
    const parameterSettings = subcategorySettings.parameters.find((param: { name: string; }) => param.name === parameter);
    if (!parameterSettings) {
      this.log.warn(`There is no parameter ${parameter} for OBS settings category ${category}.${subcategory}`);
      return [];
    }
  
    return parameterSettings.values.map( (value: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.values(value)[0]);
  };

  startStats = (): boolean => { 
    this._perfStatTimer = setInterval(() => {
      const stats = osn.OBS_API_getPerformanceStatistics();
      this._mainWin?.webContents.send('performanceStatistics', stats);
    }, 1000);
    return true;
  };

  stopStats = (): boolean => {
    clearInterval(this._perfStatTimer!);
    this._perfStatTimer = null;
    return true;
  };  

  setupPreview = (window: BrowserWindow | null, bounds: any) => {
    osn.OBS_content_createSourcePreviewDisplay(
      window?.getNativeWindowHandle(),
      '', // or use camera source Id here
      this._displayId,
    );
    osn.OBS_content_setShouldDrawUI(this._displayId, false);
    osn.OBS_content_setPaddingSize(this._displayId, 0);
    // Match padding color with main window background color
    osn.OBS_content_setPaddingColor(this._displayId, 20, 20, 20);
  
    return this.resizePreview(window, bounds);
  };

  resizePreview = (window: BrowserWindow | null, bounds: any) => {
    let initY = 0;

    const { aspectRatio, scaleFactor } = this.displayInfo();
    const displayWidth = Math.floor(bounds.width);
    const displayHeight = Math.round(displayWidth / aspectRatio);
    const displayX = Math.floor(bounds.x);
    const displayY = Math.floor(bounds.y);
    if (initY === 0) {
      initY = displayY;
    }
    osn.OBS_content_resizeDisplay(this._displayId, displayWidth * scaleFactor, displayHeight * scaleFactor);
  
    osn.OBS_content_moveDisplay(this._displayId, displayX * scaleFactor, displayY * scaleFactor);
  
    return { height: displayHeight };
  };

  removePreview = (): void => {
    try {
      console.log(this._displayId)
      osn.OBS_content_destroyDisplay(this._displayId);
    } catch (error) {
      console.error(error);
      throw error;      
    }
  };

  displayInfo = () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.size;
    const { scaleFactor } = primaryDisplay;
    return {
      width,
      height,
      scaleFactor:    scaleFactor,
      aspectRatio:    width / height,
      physicalWidth:  width * scaleFactor,
      physicalHeight: height * scaleFactor,
    };
  };

  // update
  changeActiveScene = (scene: SceneName) => {
    try {
      const currentScene = SceneFactory.fromName(scene);
      this._currentScene = scene;
      Global.setOutputSource(1, currentScene);
    } catch (error) {
      this.log.error(error);
    }
  }

  changeSourceVisibility = (data: { source: string, visible: boolean, scene: SceneName}) => {
    try {
      const scene = SceneFactory.fromName(data.scene);
      const sceneItem = scene.findItem(data.source);
      sceneItem.visible = data.visible;
    } catch (error) {
      this.log.error(error);
    }
  }

  changeSourceText = (data: { source: string, text: string, scene: SceneName}) => {
    try {
      const scene = SceneFactory.fromName(data.scene);
      const sceneItem = scene.findItem(data.source).source;
      let settings = sceneItem.settings;
      settings['text'] = data.text;
      sceneItem.update(settings);
      sceneItem.save();
    } catch (error) {
      this.log.error(error);
    }
  }

  updateTeamLogo = (homeTeam: boolean, filePath: string) => {
    try {
      const scene = SceneFactory.fromName(SceneName.Background);
      let sceneItem;
      let settings;
      if(homeTeam) {
        sceneItem = scene.findItem('home_logo').source;
        // this._store.set('GameStatut.HomeTeam.logo', filePath);
        settings = sceneItem.settings;
      } else {
        sceneItem = scene.findItem('away_logo').source;
        // this._store.set('GameStatut.AwayTeam.logo', filePath);
        settings = sceneItem.settings;
      }
      settings['file'] = filePath;
      sceneItem.update(settings);
      sceneItem.save();
    } catch (error) {
      this.log.error(error);
    }
  }

  updateBackgroundImage = (filePath: string) => {
    try {      
      const scene = SceneFactory.fromName(SceneName.Background);
      const sceneItem = scene.findItem('bg_image').source;
      let settings = sceneItem.settings;
      settings['file'] = filePath;
      sceneItem.update(settings);
      sceneItem.save();
      // this._store.set('BackgroundImage', filePath);
    } catch (error) {
      this.log.error(error);
    }
  }

}

export default OBSRecorder.Instance;

