import { IpcChannelInterface, SystemInfoChannel, StoredConfigChannel, ObsSettingsChannel, FileUploadChannel, ScoreboardInfoChannel, SponsorsDataChannel, PlayersDataChannel, PathsDataChannel } from "./IPC";
import { ipcMain, WebContents } from "electron";
import ElectronLog from 'electron-log';
import { PathsType } from "../../src/Models";

export default class IPCChannels {
  
  log: ElectronLog.LogFunctions;
  paths: PathsType;  
  mainWindow: WebContents;
  scoreboardWindow: WebContents;

  constructor(paths: PathsType, mainWindow: WebContents, scoreboardWindow: WebContents) {
    this.log = ElectronLog.scope('IPC Channel');
    this.paths = paths;
    this.mainWindow = mainWindow;
    this.scoreboardWindow = scoreboardWindow;
    this.registerIpcChannels([
      new SystemInfoChannel(),
      new StoredConfigChannel(),
      new ObsSettingsChannel(this.paths),
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