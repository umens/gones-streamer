// import { autoUpdater } from "electron-updater";

import { BrowserWindowConstructorOptions, BrowserWindow, protocol } from "electron";
import ElectronLog from 'electron-log';
import { join } from "path";
// import url from 'url';
import isDev from 'electron-is-dev';
// import { promises as fs } from "fs";
import { Utilities } from "../Utilities";

export default class ScoreboardWindow {

  log: ElectronLog.LogFunctions;
  private utilities: Utilities = new Utilities();

  private config: BrowserWindowConstructorOptions | null = null;
  window: BrowserWindow | null = null;
  ready: boolean = false;

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
      // show: false,
      show: true,
      frame: false,
      webPreferences: {    
        // offscreen: true,
        // transparent: true,
        backgroundThrottling: false,
        webSecurity: false, // handle local file bug
        allowRunningInsecureContent: false,
        additionalArguments: ['--allow-file-access-from-files'], // handle local file bug
        preload: join(__dirname, "preload.bundle.js") // use a preload script
      }
    };
    this.log.info('%cCreating Scoreboard Window', 'color: blue');
    this.window = new BrowserWindow(this.config);
    // this.window.webContents.setFrameRate(60);

    this.window.on('closed', () => this.window = null);
    // this.window.on('ready-to-show', () => (this.ready = true));
    // this.window.webContents.on('paint', async (event, dirty, image) => {
    //   if (!this.ready) return
    //   // handle frame
    //   // console.log(`The screenshot has been successfully saved to ${join(process.cwd(), 'scoreboard.png')}`)
    //   await fs.writeFile(join(this.utilities.paths.appFolder, 'scoreboard.png'), image.toPNG());
    // })

    this.window.center();
    
    if (isDev) {
      this.window.loadURL('http://localhost:3000/index.html#/scoreboard');
    } else {
      // 'build/index.html'
      this.window.removeMenu();
      this.window.loadURL(`file://${__dirname}/index.html#/scoreboard`);
      // this.window.loadURL(url.format({
      //   pathname: `${__dirname}/index.html#/scoreboard`,
      //   protocol: 'file:',
      //   slashes: true
      // }));
    }
  }
}