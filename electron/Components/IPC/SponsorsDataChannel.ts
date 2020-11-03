import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent } from 'electron';
import { IpcRequest, MediaType, PathsType, Sponsor } from "../../../src/Models";
import { join } from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Utilities } from "../../Utilities";
import { stringify } from "querystring";

export class SponsorsDataChannel implements IpcChannelInterface {

  paths: PathsType;

  constructor(paths: PathsType) {
    this.paths = paths;
  }

  getName(): string {
    return 'sponsors-data';
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }
    try {
      if(request.params && request.params.action) {
        switch (request.params.action) {
          case 'add':
            if(request.params.sponsor) {
              let sponsor = request.params.sponsor as Sponsor;
              sponsor.uuid = uuidv4();
              let fileName = sponsor.uuid + '.' + Utilities.getExtension(sponsor.media!);
              await fs.copyFile(sponsor.media!, join(this.paths.sponsorsFolder, '/medias/' + fileName));
              sponsor.media = join(this.paths.sponsorsFolder, '/medias/' + fileName);
              if(sponsor.mediaType === MediaType.Video) {
                const videoUtils = new Utilities().video;
                sponsor.duration = await videoUtils.getVideoDuration(join(this.paths.sponsorsFolder, '/medias/' + fileName));
                await fs.mkdir(join(this.paths.sponsorsFolder, '/medias/' + sponsor.uuid));
                await videoUtils.makeScreenshotsPreview({ mediaPath: join(this.paths.sponsorsFolder, '/medias/' + fileName), destPath: join(this.paths.sponsorsFolder, '/medias/' + sponsor.uuid) });
              }
              const rawSponsors = await fs.readFile(join(this.paths.sponsorsFolder, '/sponsors.json'), 'utf8');
              const sponsors: Sponsor[] = JSON.parse(rawSponsors);
              sponsors.push(sponsor);
              await fs.writeFile(
                join(this.paths.sponsorsFolder, '/sponsors.json'),
                JSON.stringify(sponsors, null, 2),
              );
              event.sender.send(request.responseChannel, sponsors);
            }        
            break;
          case 'delete':
            if(request.params.id) {
              const id = request.params.id as string;
              const rawSponsors = await fs.readFile(join(this.paths.sponsorsFolder, '/sponsors.json'), 'utf8');
              const sponsors: Sponsor[] = JSON.parse(rawSponsors);
              const sponsorIndex = sponsors.findIndex((obj => obj.uuid === id));
              await fs.unlink(sponsors[sponsorIndex].media!);
              if(sponsors[sponsorIndex].mediaType === MediaType.Video) {
                await fs.rmdir(join(this.paths.sponsorsFolder, '/medias/' + sponsors[sponsorIndex].uuid), { recursive: true })
              }
              sponsors.splice(sponsorIndex, 1);
              await fs.writeFile(
                join(this.paths.sponsorsFolder, '/sponsors.json'),
                JSON.stringify(sponsors, null, 2),
              );
              event.sender.send(request.responseChannel, sponsors);
            }            
            break;
          case 'edit':
            if(request.params.sponsor) {
              let sponsor = request.params.sponsor as Sponsor;
              const rawSponsors = await fs.readFile(join(this.paths.sponsorsFolder, '/sponsors.json'), 'utf8');
              const sponsors: Sponsor[] = JSON.parse(rawSponsors);
              const sponsorIndex = sponsors.findIndex((obj => obj.uuid === sponsor.uuid));
              // delete old files              
              await fs.unlink(sponsors[sponsorIndex].media!);
              if(sponsors[sponsorIndex].mediaType === MediaType.Video) {
                await fs.rmdir(join(this.paths.sponsorsFolder, '/medias/' + sponsors[sponsorIndex].uuid), { recursive: true })
              }
              // update sponsor
              sponsors[sponsorIndex].label = sponsor.label;
              sponsors[sponsorIndex].mediaType = sponsor.mediaType;
              let fileName = sponsor.uuid + '.' + Utilities.getExtension(sponsor.media!);
              await fs.copyFile(sponsor.media!, join(this.paths.sponsorsFolder, '/medias/' + fileName));
              sponsors[sponsorIndex].media = join(this.paths.sponsorsFolder, '/medias/' + fileName);
              if(sponsor.mediaType === MediaType.Video) {
                const videoUtils = new Utilities().video;
                sponsors[sponsorIndex].duration = await videoUtils.getVideoDuration(join(this.paths.sponsorsFolder, '/medias/' + fileName));
                await fs.mkdir(join(this.paths.sponsorsFolder, '/medias/' + sponsor.uuid));
                await videoUtils.makeScreenshotsPreview({ mediaPath: join(this.paths.sponsorsFolder, '/medias/' + fileName), destPath: join(this.paths.sponsorsFolder, '/medias/' + sponsor.uuid) });
              }
              else {
                sponsors[sponsorIndex].duration = undefined;
              }
              // update file
              await fs.writeFile(
                join(this.paths.sponsorsFolder, '/sponsors.json'),
                JSON.stringify(sponsors, null, 2),
              );
              event.sender.send(request.responseChannel, sponsors);
            }  
            break;
          case 'get':
            const rawSponsors = await fs.readFile(join(this.paths.sponsorsFolder, '/sponsors.json'), 'utf8');
            const sponsors: Sponsor[] = JSON.parse(rawSponsors);
            event.sender.send(request.responseChannel, sponsors);
            break;
        
          default:
            break;
        }
      }
    } catch (error) {
      event.sender.send(request.responseChannel, false);
    }
  }
}