import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent } from 'electron';
import { IpcRequest, PathsType, Sponsor } from "../../../src/Models";
import { join } from 'path';
import { promises as fs } from 'fs';

export class SponsorsDataChannel implements IpcChannelInterface {

  paths: PathsType;

  constructor(paths: PathsType) {
    this.paths = paths;
  }

  getName(): string {
    return 'sponsors-data';
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    try {
      if (!request.responseChannel) {
        request.responseChannel = `${this.getName()}_response`;
      }
      
      if(request.params && request.params.getter) {
        const rawSponsors = await fs.readFile(join(this.paths.sponsorsFolder, '/sponsors.json'), 'utf8');
        const sponsors: Sponsor[] = JSON.parse(rawSponsors);
        event.sender.send(request.responseChannel, sponsors);
      } else {
        if(request.params && request.params.sponsor) {

          const rawSponsors = await fs.readFile(join(this.paths.sponsorsFolder, '/sponsors.json'), 'utf8');
          const sponsors: Sponsor[] = JSON.parse(rawSponsors);
          sponsors.push(request.params.sponsor);
          await fs.writeFile(
            join(this.paths.sponsorsFolder, '/sponsors.json'),
            JSON.stringify(sponsors, null, 2),
          );
        }
        event.sender.send(request.responseChannel, true);
      }
    } catch (error) {

    }
  }
}