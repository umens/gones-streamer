import { IpcChannelInterface, SystemInfoChannel, StoredConfigChannel, ObsSettingsChannel, FileUploadChannel } from "./IPC";
import { ipcMain } from "electron";
import * as ElectronLog from 'electron-log';
import { PathsType } from "./App";

export default class IPCChannels {
  
  log: ElectronLog.LogFunctions;
  paths: PathsType;

  constructor(paths: PathsType) {
    this.log = ElectronLog.scope('IPC Channel');
    this.paths = paths;
    this.registerIpcChannels([
      new SystemInfoChannel(),
      new StoredConfigChannel(),
      new ObsSettingsChannel(this.paths),
      new FileUploadChannel(this.paths),
    ])
  }

  private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
    ipcChannels.forEach((channel: IpcChannelInterface) => {
      this.log.verbose(`register Ipc Channel : ${channel.getName()}`);
      ipcMain.on(channel.getName(), async (event, request) => {
        try {
          await channel.handle(event, request);
        } catch (error) {
          this.log.error(error);
        }
      });
    });
  }
}