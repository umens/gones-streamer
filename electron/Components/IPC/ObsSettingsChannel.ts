import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent } from 'electron';
import { IpcRequest, PathsType } from "../../../src/Models";
import { join } from 'path';
import { promises as fs } from 'fs';

export class ObsSettingsChannel implements IpcChannelInterface {

  paths: PathsType;

  constructor(paths: PathsType) {
    this.paths = paths;
  }

  getName(): string {
    return 'obs-settings';
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    try {
      if (!request.responseChannel) {
        request.responseChannel = `${this.getName()}_response`;
      }
      
      if('setter' in request.params!) {
        const rawStreamSettingsOBS = await fs.readFile(join(this.paths.binFolder, '/obs/config/obs-studio/basic/profiles/gonesstreamer/streamEncoder.json'), 'utf8');
        const streamSettingsOBS = JSON.parse(rawStreamSettingsOBS);
        streamSettingsOBS.bitrate = request.params!['bitrate'];
        await fs.writeFile(
          join(this.paths.binFolder, '/obs/config/obs-studio/basic/profiles/gonesstreamer/streamEncoder.json'),
          JSON.stringify(streamSettingsOBS, null, 2),
        );
        event.sender.send(request.responseChannel, true);
      } else {
        const rawStreamSettingsOBS: string = await fs.readFile(join(this.paths.binFolder, '/obs/config/obs-studio/basic/profiles/gonesstreamer/streamEncoder.json'), 'utf8');
        const streamSettingsOBS = JSON.parse(rawStreamSettingsOBS);
        event.sender.send(request.responseChannel, streamSettingsOBS.bitrate as string);
      }
    } catch (error) {

    }
  }
}