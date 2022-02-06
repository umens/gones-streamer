import { IpcMainEvent } from 'electron';
import { join } from 'path';
import { promises as fs } from 'fs';
import ElectronLog from "electron-log";

import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcRequest, PathsType } from "../../../src/Models";
import OBSRecorder from '../OBSRecorder';
export class FileUploadChannel implements IpcChannelInterface {

  log: ElectronLog.LogFunctions;
  paths: PathsType;

  constructor(paths: PathsType) {
    this.log = ElectronLog.scope('FileUploadChannel');
    this.paths = paths;
  }

  getName(): string {
    return 'file-upload';
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    try {
      if (!request.responseChannel) {
        request.responseChannel = `${this.getName()}_response`;
      }

      // if('setter' in request.params!) {
        const file = request.params?.file as string;
        const isHomeTeam = request.params?.isHomeTeam as boolean || false;
        const isBg = request.params?.isBg as boolean || false;
        const ext: string = file.split('.').pop()!;
        let finalCopy: string = '';
        if(isBg) {
          finalCopy = join(this.paths.appFolder, '/bg.' + ext);
        } else {
          finalCopy = isHomeTeam ? join(this.paths.appFolder, '/home.' + ext) : join(this.paths.appFolder, '/away.' + ext);
        }
        await fs.copyFile(file, finalCopy);
        isBg ? OBSRecorder.updateBackgroundImage(finalCopy) : OBSRecorder.updateTeamLogo(isHomeTeam, finalCopy);
        event.sender.send(request.responseChannel, finalCopy + '#' + new Date().getTime());
      // } else {
      //   const rawStreamSettingsOBS: string = await fs.readFile(join(this.paths.binFolder, '/obs/config/obs-studio/basic/profiles/gonesstreamer/streamEncoder.json'), 'utf8');
      //   const streamSettingsOBS = JSON.parse(rawStreamSettingsOBS);
      //   event.sender.send(request.responseChannel, { settings: streamSettingsOBS });
      // }
    } catch (error) {
      this.log.error(error);
    }
  }
}