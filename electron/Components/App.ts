// import { autoUpdater } from "electron-updater";

import { BrowserWindowConstructorOptions, screen, BrowserWindow, app, protocol } from "electron";
import { join } from 'path';
import * as isDev from 'electron-is-dev';
import * as Store from 'electron-store';
import * as ElectronLog from 'electron-log';
import * as firstRun from 'electron-first-run';
import * as url from 'url';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import SplashScreen from "./SplashScreen";
import { StoreType, Quarter, TeamPossession } from "../../src/Models";
import IPCChannels from "./IPCChannels";
import ObsProcess from "./ObsProcess";
import { promises as fs } from 'fs';

const isPackaged = require('electron-is-packaged').isPackaged;
// const rootPath = require('electron-root-path').rootPath;

export type PathsType = {
  binFolder: string;
  appFolder: string;
}

export default class Main {
  
  log: ElectronLog.LogFunctions;
  paths: PathsType;
  
  private obsProcess: ObsProcess | null = null;
  private mainConfig: BrowserWindowConstructorOptions | null = null;
  private mainWindow: BrowserWindow | null = null;
  private splashScreen: SplashScreen | null = null;
  private IpcChannels: IPCChannels | null = null;
  private store: Store<StoreType> = new Store<StoreType>({
		defaults: {
			GameStatut: {
        AwayTeam: {
          city: 'Ville Equipe Exterieur',
          color: '#612323',
          logo: 'https://placekitten.com/450/450',
          name: 'Nom Equipe Exterieur',
          score: 0,
          timeout: 3
        },
        HomeTeam: {
          city: 'Ville Equipe Domicile',
          color: '#133155',
          logo: 'https://placekitten.com/450/450',
          name: 'Nom Equipe Domicile',
          score: 0,
          timeout: 3
        },
        Options: {
          quarter: Quarter.ONE,
          possession: TeamPossession.HOME,
          flag: false,
          showScoreboard: false,
        }
      },
      LiveSettings: {
        bitrate: 6000,
        buffer: 15,
        streamKey: ''
      },
      BackgroundImage: null
		}
  });

  constructor() {
    this.log = ElectronLog.scope('Main');
    const extraResources = (isPackaged) ? join(app.getAppPath(), '/resources') : join(app.getAppPath(), '../assets');
    this.paths = {
      binFolder: join(extraResources, '/bin'),
      appFolder: join(extraResources, '/appDatas'),
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
      await fs.mkdir(this.paths.appFolder, { recursive: true });
      // this.log.info('%c[Main] Init store', 'color: blue');
      // this.store = new Store();
      // this.store.set('isRainbow', 'false');
    } else {
      // this.log.info('%c[Main] Init store with existing value', 'color: blue');
      // this.store = new Store();
      // this.store.set('unicorn', 'tes');
    }

    this.obsProcess = new ObsProcess({ binFolder: this.paths.binFolder });
    await this.obsProcess.startObs();

    app.on('ready', this.createWindow);
    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);

    this.log.info('%cRegister IPc Channels', 'color: blue');
    this.IpcChannels = new IPCChannels(this.paths);
    } catch (error) {
      console.log(error)
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
    this.log.verbose('Creating main Window config');
    const size = screen.getPrimaryDisplay().workAreaSize;
    this.mainConfig = {
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
      title: 'Gones Streamer',
      backgroundColor: '#17242D',
      // icon: path.join(__dirname, `/../../dist/assets/logos/logo-raw.png`),
      show: false,
      webPreferences: {
        // nodeIntegration: true
        nodeIntegration: false, // is default value after Electron v5
        // contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false, // turn off remote
        webSecurity: false, // handle local file bug
        additionalArguments: ['--allow-file-access-from-files'], // handle local file bug
        preload: join(__dirname, "preload.bundle.js") // use a preload script
      }
    };
    this.log.info('%cCreating Window', 'color: blue');
    this.mainWindow = new BrowserWindow(this.mainConfig);

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

    this.mainWindow.on('closed', () => this.mainWindow = null);

    // Hot Reloading
    if (isDev) {
      // 'node_modules/.bin/electronPath'
      // require('electron-reload')(__dirname, {
      //   electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      //   forceHardReset: true,
      //   hardResetMethod: 'exit'
      // });

      // DevTools
      installExtension(REACT_DEVELOPER_TOOLS)
      .then((name: any) => this.log.verbose(`Added Extension:  ${name}`))
      .catch((err: any) => this.log.verbose('An error occurred: ', err));

      this.mainWindow.webContents.once('dom-ready', () => {
        this.mainWindow && this.mainWindow.webContents.openDevTools()
      });
    }

    this.mainWindow.webContents.on('did-finish-load', () => {
      this.log.info('%cclose Splash Window', 'color: blue');
      this.splashScreen && this.splashScreen.window && this.splashScreen.window.destroy();
      this.log.info('%cShow Main Window', 'color: blue');
      this.mainWindow && this.mainWindow.maximize();
    });
  }

  private onWindowAllClosed = async () => {
    try {
      this.log.info('%cApp Closing...', 'color: blue');
      if (process.platform !== 'darwin') {
        await this.obsProcess?.stopObs();
        app.quit();
        this.log.info('%cApp Closed.', 'color: blue');
      }
    } catch (error) {
      
    }
  }

  private onActivate = async () => {
    if (!this.mainWindow) {
      this.createWindow();
    }
  }
}