import { BrowserWindow, ipcMain } from "electron";
import ElectronLog from 'electron-log';

import { IpcChannelInterface, StoredConfigChannel, FileUploadChannel, ScoreboardInfoChannel, SponsorsDataChannel, PlayersDataChannel, PathsDataChannel, OBSChannel } from "./IPC";
import { PathsType } from "../../src/Models";

export default class IPCChannels {
  
  log: ElectronLog.LogFunctions;
  paths: PathsType;  
  mainWindow: BrowserWindow;
  scoreboardWindow: BrowserWindow;

  constructor(paths: PathsType, mainWindow: BrowserWindow, scoreboardWindow: BrowserWindow) {
    this.log = ElectronLog.scope('IPC Channel');
    this.paths = paths;
    this.mainWindow = mainWindow;
    this.scoreboardWindow = scoreboardWindow;
    this.registerIpcChannels([
      new StoredConfigChannel(),
      new OBSChannel(this.mainWindow),
      new FileUploadChannel(this.paths),
      new ScoreboardInfoChannel(),
      new SponsorsDataChannel(this.paths),
      new PlayersDataChannel(this.paths),
      new PathsDataChannel(this.paths),
    ])
  }

  private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
    ipcChannels.forEach((channel: IpcChannelInterface) => {
      this.log.verbose(`register Ipc Channel : ${channel.getName()}`);
      ipcMain.on(channel.getName(), async (event, request) => {
        try {
          if(channel.getName() === 'scoreboard-info') {
            await channel.handle(event, request, this.scoreboardWindow);
          } else {            
          await channel.handle(event, request, this.mainWindow);
          }
        } catch (error) {
          this.log.error(error);
        }
      });
    });
  }
}