import { IpcChannelInterface, SystemInfoChannel, StoredConfigChannel, ObsSettingsChannel, FileUploadChannel, ScoreboardInfoChannel } from "./IPC";
import { ipcMain, WebContents } from "electron";
import * as ElectronLog from 'electron-log';
import { PathsType } from "./App";

export default class IPCChannels {
  
  log: ElectronLog.LogFunctions;
  paths: PathsType;
  scoreboardWindow: WebContents;

  constructor(paths: PathsType, scoreboardWindow: WebContents) {
    this.log = ElectronLog.scope('IPC Channel');
    this.paths = paths;
    this.scoreboardWindow = scoreboardWindow;
    this.registerIpcChannels([
      new SystemInfoChannel(),
      new StoredConfigChannel(),
      new ObsSettingsChannel(this.paths),
      new FileUploadChannel(this.paths),
      new ScoreboardInfoChannel(),
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
          await channel.handle(event, request);
          }
        } catch (error) {
          this.log.error(error);
        }
      });
    });
  }
}