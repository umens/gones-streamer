import { IpcChannelInterface, SystemInfoChannel, StoredConfigChannel } from "./IPC";
import { functions as log } from 'electron-log';
import { ipcMain } from "electron";

export default class IPCChannels {

  constructor() {
    this.registerIpcChannels([
      new SystemInfoChannel(),
      new StoredConfigChannel(),
    ])
  }

  private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
    ipcChannels.forEach(channel => {
      log.verbose(`[Main] register Ipc Channel : ${channel.getName()}`);
      ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request))
    });
  }
}