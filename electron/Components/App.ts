// import { autoUpdater } from "electron-updater";

import { BrowserWindowConstructorOptions, screen, BrowserWindow, app, protocol } from "electron";
import { join, normalize, relative } from 'path';
import isDev from 'electron-is-dev';
import Store from 'electron-store';
import ElectronLog from 'electron-log';
import firstRun from 'electron-first-run';
import url from 'url';
// import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import { promises as fs, existsSync } from 'fs';
import { autoUpdater } from "electron-updater";

import SplashScreen from "./SplashScreen";
import { StoreType, GetDefaultConfig } from "../../src/Models";
import IPCChannels from "./IPCChannels";
import ObsProcess from "./ObsProcess";
import ScoreboardWindow from "./ScoreboardWindow";
import OBSRecorder from "./OBSRecorder";
import { Utilities } from "../Utilities";

export default class Main {
  
  log: ElectronLog.LogFunctions;
  private utilities: Utilities = new Utilities();
  
  private obsProcess: ObsProcess | null = null;
  private mainConfig: BrowserWindowConstructorOptions | null = null;
  private mainWindow: BrowserWindow | null = null;
  private splashScreen: SplashScreen | null = null;
  private scoreboardWindow: ScoreboardWindow | null = null;
  private IpcChannels: IPCChannels | null = null;
  private store: Store<StoreType> = new Store<StoreType>({
		defaults: GetDefaultConfig(this.utilities.paths)
  });

  constructor() {
    this.log = ElectronLog.scope('Main');    
    autoUpdater.logger = ElectronLog.scope('Auto Updater');
    // handle local file bug
    app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
    app.disableHardwareAcceleration();
    // console.log(this.utilities.paths);
  }

  init = async () => {
    try {
      this.log.info('%cInit', 'color: blue');
      this.log.verbose('Checking first run');
      if(firstRun({ options: 'first-run'})) {
        this.log.verbose('First run');
        if (!existsSync(this.utilities.paths.sponsorsFolder)) {
          await fs.mkdir(join(this.utilities.paths.sponsorsFolder), { recursive: true });
        }
        if(!existsSync(join(this.utilities.paths.sponsorsFolder, '/medias'))){
          await fs.mkdir(join(this.utilities.paths.sponsorsFolder, '/medias'), { recursive: true });
        }
        if (!existsSync(join(this.utilities.paths.sponsorsFolder, '/sponsors.json'))) {        
          await fs.writeFile(
            join(this.utilities.paths.sponsorsFolder, '/sponsors.json'),
            JSON.stringify([], null, 2),
          );
        }
        if (!existsSync(this.utilities.paths.playersFolder)) {
          await fs.mkdir(join(this.utilities.paths.playersFolder), { recursive: true });
        }
        if(!existsSync(join(this.utilities.paths.playersFolder, '/medias'))){
          await fs.mkdir(join(this.utilities.paths.playersFolder, '/medias'), { recursive: true });
        }
        if (!existsSync(join(this.utilities.paths.playersFolder, '/players.json'))) {        
          await fs.writeFile(
            join(this.utilities.paths.playersFolder, '/players.json'),
            JSON.stringify([], null, 2),
          );
        }
        this.log.info('%c[Main] Init store', 'color: blue');
      } else {
        this.log.info('%c[Main] Init store with existing value', 'color: blue');
        if (!existsSync(this.utilities.paths.sponsorsFolder)) {
          await fs.mkdir(join(this.utilities.paths.sponsorsFolder), { recursive: true });
        }
        if(!existsSync(join(this.utilities.paths.sponsorsFolder, '/medias'))){
          await fs.mkdir(join(this.utilities.paths.sponsorsFolder, '/medias'), { recursive: true });
        }
        if (!existsSync(join(this.utilities.paths.sponsorsFolder, '/sponsors.json'))) {        
          await fs.writeFile(
            join(this.utilities.paths.sponsorsFolder, '/sponsors.json'),
            JSON.stringify([], null, 2),
          );
        }
        if (!existsSync(this.utilities.paths.playersFolder)) {
          await fs.mkdir(join(this.utilities.paths.playersFolder), { recursive: true });
        }
        if(!existsSync(join(this.utilities.paths.playersFolder, '/medias'))){
          await fs.mkdir(join(this.utilities.paths.playersFolder, '/medias'), { recursive: true });
        }
        if (!existsSync(join(this.utilities.paths.playersFolder, '/players.json'))) {        
          await fs.writeFile(
            join(this.utilities.paths.playersFolder, '/players.json'),
            JSON.stringify([], null, 2),
          );
        }
        // this.log.info(this.store.store);
      }

      app.on('ready', async () => {
        try {
          await autoUpdater.checkForUpdatesAndNotify();
          // try {
          //   const name = await installExtension(REACT_DEVELOPER_TOOLS);
          //   this.log.verbose(`Added Extension:  ${name}`)
          // } catch (error) {
          //   this.log.verbose('An error occurred: ', error)
          // }
          await this.createWindow();
        } catch (error) {
          this.log.error(error)
        }
      });
      app.on('window-all-closed', this.onWindowAllClosed);
      app.on('before-quit', this.beforeQuit);
      app.on('activate', this.onActivate);
      app.on('will-quit', () => OBSRecorder.shutdown());
      app.on('second-instance', () => {
        // Someone tried to run a second instance, we should focus our window.
        if (this.mainWindow) {
          if (this.mainWindow.isMinimized()) this.mainWindow.restore();
          this.mainWindow.focus();
        }
      });
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
    

    // protocol.registerFileProtocol('file', (request, callback) => {
    //   const url = request.url.substr(7);
    //   console.log(relative(url, __dirname))
    //   const extension = url.split('.').pop();
    //   if (extension && ['html', 'htm'].includes(extension)) {
    //     const pathname = request.url.replace('file:///', '');
    //     callback(pathname);        
    //   } else {
    //     console.log(relative(url, __dirname))
    //     console.log(relative(request.url, __dirname))
    //     console.log(normalize(relative(request.url, __dirname)))
    //     callback({path: normalize(relative(request.url, __dirname))})
    //   }
    // });
    // protocol.interceptFileProtocol('file', (request, callback) => {
    //   const url = request.url.substr(7);
    //   const extension = url.split('.').pop();
    //   if (extension && ['html', 'htm'].includes(extension)) {
    //     const pathname = request.url.replace('file:///', '');
    //     callback(pathname);        
    //   } else {
    //     console.log(relative(url, __dirname))
    //     console.log(relative(request.url, __dirname))
    //     console.log(normalize(relative(request.url, __dirname)))
    //     callback({path: normalize(relative(request.url, __dirname))})
    //   }
    // });

    this.log.verbose('Creating splashScreen');
    this.splashScreen = new SplashScreen();
    // TODO: check this to hide this windows https://www.electronjs.org/docs/tutorial/offscreen-rendering
    this.log.verbose('Creating scoreboard Window');

    this.scoreboardWindow = new ScoreboardWindow();
    this.log.verbose('Creating main Window config');
    const size = screen.getPrimaryDisplay().workAreaSize;
    this.mainConfig = {
      show: false,
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
      title: 'Gones Streamer',
      backgroundColor: '#17242D',
      // icon: path.join(__dirname, `/../../dist/assets/logos/logo-raw.png`),
      webPreferences: {
        webSecurity: false, // handle local file bug
        allowRunningInsecureContent: false,
        additionalArguments: ['--allow-file-access-from-files'], // handle local file bug
        preload: join(__dirname, "preload.bundle.js") // use a preload script
      }
    };
    this.log.info('%cCreating Window', 'color: blue');
    this.mainWindow = new BrowserWindow(this.mainConfig);

    require('@electron/remote/main').enable(this.mainWindow.webContents);
    OBSRecorder.initialize(this.mainWindow);

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
      // 'node_modules/.bin/electronPath'
      // require('electron-reload')(__dirname, {
      //   electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      //   forceHardReset: true,
      //   hardResetMethod: 'exit'
      // });

      // this.mainWindow.webContents.on("did-frame-finish-load", async () => {
      //   try {
      //     const name = await installExtension(REACT_DEVELOPER_TOOLS);
      //     this.log.verbose(`Added Extension:  ${name}`)
      //   } catch (error) {
      //     this.log.verbose('An error occurred: ', error)
      //   }
      // });
      // DevTools
      // installExtension(REACT_DEVELOPER_TOOLS)
      // .then((name: any) => this.log.verbose(`Added Extension:  ${name}`))
      // .catch((err: any) => this.log.verbose('An error occurred: ', err));

      
      // this.mainWindow.webContents.on("did-frame-finish-load", () => {
      //   this.mainWindow && this.mainWindow.webContents.once("devtools-opened", () => {
      //     this.mainWindow && this.mainWindow.focus();
      //   });
      //   this.mainWindow && this.mainWindow.webContents.openDevTools();
      // });
      this.mainWindow.webContents.once('dom-ready', () => {
        this.mainWindow && this.mainWindow.webContents.openDevTools();
      });
    }

    this.mainWindow.webContents.on('did-finish-load', () => {

      this.log.info('%cRegister IPc Channels', 'color: blue');
      this.IpcChannels = new IPCChannels(this.utilities.paths, this.mainWindow!, this.scoreboardWindow?.window!);
        
      this.log.info('%cclose Splash Window', 'color: blue');
      this.splashScreen && this.splashScreen.window && this.splashScreen.window.destroy();

      this.log.info('%cShow Main Window', 'color: blue');
      this.mainWindow && this.mainWindow.maximize() && this.mainWindow.focus();
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