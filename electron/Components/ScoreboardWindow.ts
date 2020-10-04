// import { autoUpdater } from "electron-updater";

import { BrowserWindowConstructorOptions, BrowserWindow, protocol } from "electron";
import * as ElectronLog from 'electron-log';
import { join } from "path";
import * as url from 'url';
import * as isDev from 'electron-is-dev';

export default class ScoreboardWindow {

  log: ElectronLog.LogFunctions;

  private config: BrowserWindowConstructorOptions | null = null;
  window: BrowserWindow | null = null;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    this.log = ElectronLog.scope('ScoreboardWindow');
    this.log.verbose('Creating ScoreboardWindow');
    this.createScoreboardWindow();
    // const log = require("electron-log")
    // log.transports.file.level = "debug"
    // autoUpdater.logger = log
    // autoUpdater.checkForUpdatesAndNotify()
  }

  private createScoreboardWindow() {
    
    protocol.registerFileProtocol('file', (request, callback) => {
      const pathname = request.url.replace('file:///', '');
      callback(pathname);
    });
    
    this.log.verbose('Creating Scoreboard Window config');
    this.config = {
      width: 1000,
      height: 100,
      title: 'Gones Streamer - Scoreboard',
      // backgroundColor: '#008000',
      // show: false,
      // autoHideMenuBar: true,
      frame: false,
      webPreferences: {        
        nodeIntegration: true,
        webSecurity: false, // handle local file bug
        additionalArguments: ['--allow-file-access-from-files'], // handle local file bug
        preload: join(__dirname, "preload.bundle.js") // use a preload script
      }
    };
    this.log.info('%cCreating Scoreboard Window', 'color: blue');
    this.window = new BrowserWindow(this.config);

    this.window.on('closed', () => this.window = null);

    this.window.center();
    
    if (isDev) {
      this.window.loadURL('http://localhost:3000/index.html#/scoreboard');
    } else {
      // 'build/index.html'
      this.window.removeMenu();
      this.window.loadURL(url.format({
        pathname: join(__dirname, './index.html#/scoreboard'),
        protocol: 'file:',
        slashes: true
      }));
    }
  }
}