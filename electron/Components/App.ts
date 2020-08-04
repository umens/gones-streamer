// import { autoUpdater } from "electron-updater";

import { BrowserWindowConstructorOptions, screen, BrowserWindow, app } from "electron";
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { StoreType } from "../../shared/Store";
import * as Store from 'electron-store';
import { functions as log } from 'electron-log';
import * as firstRun from 'electron-first-run';
import * as url from 'url';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import SplashScreen from "./SplashScreen";
import { Quarter, TeamPossession } from "../../shared";
import IPCChannels from "./IPCChannels";

export default class Main {
  private mainConfig: BrowserWindowConstructorOptions | null = null;
  private mainWindow: BrowserWindow | null = null;
  private splashScreen: SplashScreen | null = null;
  private IpcChannels: IPCChannels | null = null;
  private store: Store<StoreType> = new Store<StoreType>({
		defaults: {
			GameStatus: {
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
        streamKey: null
      },
      BackgroundImage: null
		}
  });

  // constructor() {
  //   log.verbose('[Main] Creating splashScreen');
  //   this.splashScreen = new SplashScreen();
  // }

  public init() {
    log.info('%c[Main] Init', 'color: blue');
    log.verbose('[Main] Checking first run');
    console.log(app.getPath('userData'));
    if(firstRun({ options: 'first-run'})) {
      log.verbose('[Main] First run');
      // log.info('%c[Main] Init store', 'color: blue');
      // this.store = new Store();
      // this.store.set('isRainbow', 'false');

    } else {
      // log.info('%c[Main] Init store with existing value', 'color: blue');
      // this.store = new Store();
      // this.store.set('unicorn', 'tes');
    }

    app.on('ready', this.createWindow);
    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);

    log.info('%c[Main] Register IPc Channels', 'color: blue');
    this.IpcChannels = new IPCChannels();
  }

  private createWindow() {
    log.verbose('[Main] Creating splashScreen');
    this.splashScreen = new SplashScreen();
    log.verbose('[Main] Creating main Window config');
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
        preload: path.join(__dirname, "preload.bundle.js") // use a preload script
      }
    };
    log.info('%c[Main] Creating Window', 'color: blue');
    this.mainWindow = new BrowserWindow(this.mainConfig);

    if (isDev) {
      this.mainWindow.loadURL('http://localhost:3000/index.html');
    } else {
      // 'build/index.html'
      this.mainWindow.removeMenu();
      this.mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './index.html'),
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
      .then((name: any) => log.verbose(`[Main] Added Extension:  ${name}`))
      .catch((err: any) => log.verbose('[Main] An error occurred: ', err));

      this.mainWindow.webContents.openDevTools();
    }

    this.mainWindow.webContents.on('did-finish-load', () => {
      setTimeout(() => {
        log.info('%c[Main] close Splash Window', 'color: blue');
        this.splashScreen && this.splashScreen.window && this.splashScreen.window.destroy();
        log.info('%c[Main] Show Main Window', 'color: blue');
        this.mainWindow && this.mainWindow.maximize();
      }, 2000);
    });
  }

  private onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private onActivate() {
    if (!this.mainWindow) {
      this.createWindow();
    }
  }
}