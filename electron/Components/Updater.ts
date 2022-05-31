
import { ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import ElectronLog from "electron-log";
import { WebContents } from "electron/main";
import { AutoUpdaterData, AutoUpdaterEvent, StoreType } from "../../src/Models";
import Store from 'electron-store';
import StoreConfig from "./StoreConfig";
import prettyBytes from "pretty-bytes";

export default class AppUpdater {

  log: ElectronLog.LogFunctions;
  mainWindow: WebContents;
  store: Store<StoreType> = StoreConfig;

  constructor(mainWindow: WebContents) {
    this.log = ElectronLog.scope('Auto Updater');
    autoUpdater.logger = ElectronLog.scope('Auto Updater');
    autoUpdater.autoDownload = false;
    autoUpdater.channel = this.store.get('UpdateChannel');
    // this.log.transports.file.level = isDev ? 'debug' : 'info';
    autoUpdater.logger = this.log;
    this.mainWindow = mainWindow;

    autoUpdater.on('checking-for-update', () => {
      this.sendStatusToWindow(AutoUpdaterEvent.CHECKING, { message: 'Checking for update...' });
    });
    autoUpdater.on('update-available', (info) => {
      this.sendStatusToWindow(AutoUpdaterEvent.AVAILABLE, { message: 'Update available !', version: info.tag, releaseNote: info.releaseNotes });
    });
    autoUpdater.on('update-not-available', (info) => {
      this.sendStatusToWindow(AutoUpdaterEvent.NOUPDATE, { message: 'You already have the lastest version.' });
    });
    autoUpdater.on('error', (err) => {
    this.sendStatusToWindow(AutoUpdaterEvent.ERROR, { message: 'Error in auto-updater. ' + err });
    });
    autoUpdater.on('download-progress', (progressObj) => {
      this.sendStatusToWindow(AutoUpdaterEvent.DOWNLOADING, { message: `${prettyBytes(progressObj.transferred)}/${prettyBytes(progressObj.total)} @ ${prettyBytes(progressObj.bytesPerSecond)}/s`, download: progressObj });
    });
    autoUpdater.on('update-downloaded', (info) => {
      this.sendStatusToWindow(AutoUpdaterEvent.DOWNLOADED, { message: 'Update downloaded !' });
    });

    ipcMain.handle('autoUpdater', this.handleResponseUpdater);
  }

  checkUpdate = () => {
    autoUpdater.checkForUpdates();
  }

  sendStatusToWindow = (eventType: AutoUpdaterEvent, data: AutoUpdaterData) => {
    this.mainWindow.send('autoUpdate', { eventType, data });
  }

  handleResponseUpdater = (event: Electron.IpcMainInvokeEvent, eventType: AutoUpdaterEvent, data?: string) => {
    switch (eventType) {
      case AutoUpdaterEvent.CHANNELCHANGED: 
        this.store.set('UpdateChannel', data);
        break;
      case AutoUpdaterEvent.CHECKRESQUESTED:
        this.checkUpdate();
        break;
      case AutoUpdaterEvent.DOWNLOADRESQUESTED:
        autoUpdater.downloadUpdate();
        break;
      case AutoUpdaterEvent.QUITANDINSTALL:
        autoUpdater.quitAndInstall();
        break;
    
      default:
        break;
    }
  }
}