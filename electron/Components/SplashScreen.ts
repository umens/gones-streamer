// import { autoUpdater } from "electron-updater";

import { BrowserWindowConstructorOptions, BrowserWindow } from "electron";
import { functions as log } from 'electron-log';
import * as path from 'path';

export default class SplashScreen {

  private config: BrowserWindowConstructorOptions | null = null;
  window: BrowserWindow | null = null;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    log.verbose('[SplashScreen] Creating splashScreen');
    this.createSplashScreen();
    // const log = require("electron-log")
    // log.transports.file.level = "debug"
    // autoUpdater.logger = log
    // autoUpdater.checkForUpdatesAndNotify()
  }

  private createSplashScreen() {
    log.verbose('[SplashScreen] Creating splash Window config');
    this.config = {
      width: 500,
      height: 450,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
    };
    log.info('%c[SplashScreen] Creating splash Window', 'color: blue');
    this.window = new BrowserWindow(this.config);

    this.window.on('closed', () => this.window = null);

    this.window.center();
    this.window.loadFile(path.join(__dirname, "screens/splash-screen.html"));
  }
}