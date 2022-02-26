import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainInvokeEvent } from 'electron';
import { IpcRequest, PathsType } from "../../../src/Models";
import { join } from 'path';
import { promises as fs } from 'fs';
import ElectronLog from "electron-log";

export class ObsSettingsChannel implements IpcChannelInterface {

  log: ElectronLog.LogFunctions;
  paths: PathsType;

  constructor(paths: PathsType) {
    this.log = ElectronLog.scope('ObsSettingsChannel');
    this.paths = paths;
  }

  getName(): string {
    return 'obs-settings';
  }

  async handle(event: IpcMainInvokeEvent, request: IpcRequest): Promise<boolean | string> {
    try {
      // if (!request.responseChannel) {
      //   request.responseChannel = `${this.getName()}_response`;
      // }
      
      if(request.params && 'setter' in request.params && request.params.setter) {
        const rawStreamSettingsOBS = await fs.readFile(join(this.paths.binFolder, '/obs/config/obs-studio/basic/profiles/gonesstreamer/streamEncoder.json'), 'utf8');
        const streamSettingsOBS = JSON.parse(rawStreamSettingsOBS);
        streamSettingsOBS.bitrate = request.params.bitrate;
        await fs.writeFile(
          join(this.paths.binFolder, '/obs/config/obs-studio/basic/profiles/gonesstreamer/streamEncoder.json'),
          JSON.stringify(streamSettingsOBS, null, 2),
        );
        // event.sender.send(request.responseChannel, true);
        return true;
      } else {
        const rawStreamSettingsOBS: string = await fs.readFile(join(this.paths.binFolder, '/obs/config/obs-studio/basic/profiles/gonesstreamer/streamEncoder.json'), 'utf8');
        const streamSettingsOBS = JSON.parse(rawStreamSettingsOBS);
        // event.sender.send(request.responseChannel, streamSettingsOBS.bitrate as string);
        return streamSettingsOBS.bitrate as string;
      }
    } catch (error) {
      this.log.error(error);
      throw error;
    }
  }
}