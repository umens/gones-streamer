import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import { IpcChannelInterface, SystemInfoChannel } from './IPC';
import { functions as log } from 'electron-log';

class Main {  
  private mainWindow: BrowserWindow | null = null;

  public init(ipcChannels: IpcChannelInterface[]) {
    log.info('%c[Main] Init', 'color: blue');
    app.on('ready', this.createWindow);
    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);
    
    log.info('%c[Main] Register IPc Channels', 'color: blue');
    this.registerIpcChannels(ipcChannels);
  }

  private createWindow() {
    log.info('%c[Main] Creating Window', 'color: blue');
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        // nodeIntegration: true
        nodeIntegration: false, // is default value after Electron v5
        // contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false, // turn off remote
        preload: path.join(__dirname, "preload.js") // use a preload script
      }
    });  
    this.mainWindow.maximize();
  
    if (isDev) {
      this.mainWindow.loadURL('http://localhost:3000/index.html');
    } else {
      // 'build/index.html'
      this.mainWindow.loadURL(`file://${__dirname}/../index.html`);
    }
  
    this.mainWindow.on('closed', () => this.mainWindow = null);
  
    // Hot Reloading
    if (isDev) {
      // 'node_modules/.bin/electronPath'
      require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
        forceHardReset: true,
        hardResetMethod: 'exit'
      });
      
      // DevTools
      installExtension(REACT_DEVELOPER_TOOLS)
      .then((name: any) => log.verbose(`[Main] Added Extension:  ${name}`))
      .catch((err: any) => log.verbose('[Main] An error occurred: ', err));
      
      this.mainWindow.webContents.openDevTools();
    }

    this.mainWindow.webContents.on('did-finish-load', () => {
      log.info('%c[Main] Show Window', 'color: blue');
      this.mainWindow && this.mainWindow.show();
    });
  }

  private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
    ipcChannels.forEach(channel => {
      log.verbose(`[Main] register Ipc Channel : ${channel.getName()}`);
      ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request))
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

// Here we go!
log.info('%c[Main] Starting app', 'color: blue');
(new Main()).init([
  new SystemInfoChannel()
]);