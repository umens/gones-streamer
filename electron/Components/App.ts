// import { autoUpdater } from "electron-updater";

import { BrowserWindowConstructorOptions, screen, BrowserWindow, app, protocol } from "electron";
import { join } from 'path';
import isDev from 'electron-is-dev';
import Store from 'electron-store';
import ElectronLog from 'electron-log';
import firstRun from 'electron-first-run';
import url from 'url';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import SplashScreen from "./SplashScreen";
import { StoreType, GetDefaultConfig, PathsType } from "../../src/Models";
import IPCChannels from "./IPCChannels";
import ObsProcess from "./ObsProcess";
import { promises as fs, existsSync } from 'fs';
import ScoreboardWindow from "./ScoreboardWindow";
import { autoUpdater } from "electron-updater";

export default class Main {
  
  log: ElectronLog.LogFunctions;
  paths: PathsType;
  
  private obsProcess: ObsProcess | null = null;
  private mainConfig: BrowserWindowConstructorOptions | null = null;
  private mainWindow: BrowserWindow | null = null;
  private splashScreen: SplashScreen | null = null;
  private scoreboardWindow: ScoreboardWindow | null = null;
  private IpcChannels: IPCChannels | null = null;
  private store: Store<StoreType> = new Store<StoreType>({
		defaults: GetDefaultConfig()
  });

  constructor() {
    this.log = ElectronLog.scope('Main');    
    autoUpdater.logger = ElectronLog.scope('Auto Updater');
    const extraResources = app.isPackaged ? join(app.getAppPath(), '../') : join(app.getAppPath(), '../assets');
    this.paths = {
      binFolder: join(extraResources, '/bin'),
      appFolder: join(extraResources, '/appDatas'),
      sponsorsFolder: join(extraResources, '/sponsors'),
      playersFolder: join(extraResources, '/players'),
    }
    // handle local file bug
    app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
    // console.log(this.paths);
  }

  init = async () => {
    try {
      // const test = fs.readdirSync(this.paths.binFolder);
      // console.log(test);
      this.log.info('%cInit', 'color: blue');
      this.log.verbose('Checking first run');
      if(firstRun({ options: 'first-run'})) {
        this.log.verbose('First run');
        if(!existsSync(join(this.paths.binFolder, '/obs/config/obs-studio/basic/profiles/gonesstreamer/service.json'))){
          await fs.rename(join(this.paths.binFolder, '/obs/config/obs-studio/basic/profiles/gonesstreamer/service.json.sample'), join(this.paths.binFolder, '/obs/config/obs-studio/basic/profiles/gonesstreamer/service.json'));
        }
        if (!existsSync(this.paths.sponsorsFolder)) {
          await fs.mkdir(join(this.paths.sponsorsFolder), { recursive: true });
        }
        if(!existsSync(join(this.paths.sponsorsFolder, '/medias'))){
          await fs.mkdir(join(this.paths.sponsorsFolder, '/medias'), { recursive: true });
        }
        if (!existsSync(join(this.paths.sponsorsFolder, '/sponsors.json'))) {        
          await fs.writeFile(
            join(this.paths.sponsorsFolder, '/sponsors.json'),
            JSON.stringify([], null, 2),
          );
        }
        if (!existsSync(this.paths.playersFolder)) {
          await fs.mkdir(join(this.paths.playersFolder), { recursive: true });
        }
        if(!existsSync(join(this.paths.playersFolder, '/medias'))){
          await fs.mkdir(join(this.paths.playersFolder, '/medias'), { recursive: true });
        }
        if (!existsSync(join(this.paths.playersFolder, '/players.json'))) {        
          await fs.writeFile(
            join(this.paths.playersFolder, '/players.json'),
            JSON.stringify([], null, 2),
          );
        }
        // this.log.info('%c[Main] Init store', 'color: blue');
        // this.store = new Store();
        // this.store.set('isRainbow', 'false');
      } else {
        // this.log.info('%c[Main] Init store with existing value', 'color: blue');
        // this.store = new Store();
        // this.store.set('unicorn', 'tes');
        if(!existsSync(join(this.paths.binFolder, '/obs/config/obs-studio/basic/profiles/gonesstreamer/service.json'))){
          await fs.rename(join(this.paths.binFolder, '/obs/config/obs-studio/basic/profiles/gonesstreamer/service.json.sample'), join(this.paths.binFolder, '/obs/config/obs-studio/basic/profiles/gonesstreamer/service.json'));
        }
        if (!existsSync(this.paths.sponsorsFolder)) {
          await fs.mkdir(join(this.paths.sponsorsFolder), { recursive: true });
        }
        if(!existsSync(join(this.paths.sponsorsFolder, '/medias'))){
          await fs.mkdir(join(this.paths.sponsorsFolder, '/medias'), { recursive: true });
        }
        if (!existsSync(join(this.paths.sponsorsFolder, '/sponsors.json'))) {        
          await fs.writeFile(
            join(this.paths.sponsorsFolder, '/sponsors.json'),
            JSON.stringify([], null, 2),
          );
        }
        if (!existsSync(this.paths.playersFolder)) {
          await fs.mkdir(join(this.paths.playersFolder), { recursive: true });
        }
        if(!existsSync(join(this.paths.playersFolder, '/medias'))){
          await fs.mkdir(join(this.paths.playersFolder, '/medias'), { recursive: true });
        }
        if (!existsSync(join(this.paths.playersFolder, '/players.json'))) {        
          await fs.writeFile(
            join(this.paths.playersFolder, '/players.json'),
            JSON.stringify([], null, 2),
          );
        }
        this.log.info('created')
      }

      this.obsProcess = new ObsProcess({ binFolder: this.paths.binFolder });
      await this.obsProcess.startObs();

      app.on('ready', async () => {
        try {
          await autoUpdater.checkForUpdatesAndNotify();
          await this.createWindow();
        } catch (error) {
          this.log.error(error)
        }
      });
      app.on('window-all-closed', this.onWindowAllClosed);
      app.on('before-quit', this.beforeQuit);
      app.on('activate', this.onActivate);
    } catch (error) {
      this.log.error(error)
    }
  }

  private createWindow = async () => {
    // handle local file bug
    protocol.registerFileProtocol('file', (request, callback) => {
      const pathname = request.url.replace('file:///', '');
      callback(pathname);
    });

    this.log.verbose('Creating splashScreen');
    this.splashScreen = new SplashScreen();
    // TODO: check this to hide this windows https://www.electronjs.org/docs/tutorial/offscreen-rendering
    this.log.verbose('Creating scoreboard Window');

    this.scoreboardWindow = new ScoreboardWindow();
    this.log.verbose('Creating main Window config');
    const size = screen.getPrimaryDisplay().workAreaSize;
    this.mainConfig = {
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
      title: 'Gones Streamer',
      backgroundColor: '#17242D',
      // alwaysOnTop: true,
      // icon: path.join(__dirname, `/../../dist/assets/logos/logo-raw.png`),
      show: false,
      webPreferences: {
        // nodeIntegration: true
        // nodeIntegration: false, // is default value after Electron v5
        // contextIsolation: true, // protect against prototype pollution
        // enableRemoteModule: false, // turn off remote
        webSecurity: false, // handle local file bug
        allowRunningInsecureContent: false,
        additionalArguments: ['--allow-file-access-from-files'], // handle local file bug
        preload: join(__dirname, "preload.bundle.js") // use a preload script
      }
    };
    this.log.info('%cCreating Window', 'color: blue');
    this.mainWindow = new BrowserWindow(this.mainConfig);
    require("@electron/remote/main").enable(this.mainWindow.webContents);

    if (isDev) {
      this.mainWindow.loadURL('http://localhost:3000/index.html');
    } else {
      // 'build/index.html'
      this.mainWindow.removeMenu();
      this.mainWindow.loadURL(url.format({
        pathname: join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true
      }));
    }

    this.mainWindow.on('close', () => {      
      this.log.info('%cclose scoreboard Window', 'color: blue');
      this.scoreboardWindow && this.scoreboardWindow.window && this.scoreboardWindow.window.destroy();
    });

    this.mainWindow.on('closed', () => this.mainWindow = null);

    // Hot Reloading
    if (isDev) {
      // DevTools
      installExtension(REACT_DEVELOPER_TOOLS)
      .then((name: any) => this.log.verbose(`Added Extension:  ${name}`))
      .catch((err: any) => this.log.verbose('An error occurred: ', err));

      this.mainWindow.webContents.once('dom-ready', () => {
        this.mainWindow && this.mainWindow.webContents.openDevTools()
      });
    }

    this.mainWindow.webContents.on('did-finish-load', () => {

      this.log.info('%cRegister IPc Channels', 'color: blue');
      this.IpcChannels = new IPCChannels(this.paths, this.mainWindow?.webContents!, this.scoreboardWindow?.window?.webContents!);

      this.log.info('%cclose Splash Window', 'color: blue');
      this.splashScreen && this.splashScreen.window && this.splashScreen.window.destroy();
      this.log.info('%cShow Main Window', 'color: blue');
      this.mainWindow && this.mainWindow.maximize();
    });
  }

  private beforeQuit = async () => {
    try {
      this.log.info('%cApp Closing...', 'color: blue');
      if(this.obsProcess) {
        await this.obsProcess.stopObs();
      }
    } catch (error) {
      this.log.error(error)
    }
  }

  private onWindowAllClosed = async () => {
    try {
      if (process.platform !== 'darwin') {
        app.quit();
      }
      this.log.info('%cApp Closed.', 'color: blue');
      process.exit(0);
    } catch (error) {
      this.log.error(error)
    }
  }

  private onActivate = async () => {
    if (!this.mainWindow) {
      this.createWindow();
    }
  }
}