import { isPackaged } from 'electron-is-packaged';
import { app } from 'electron';
import { join } from 'path';
import { VideoUtilities } from "./VideoUtilities";
import { PathsType } from '../../src/Models';

class Utilities {

  video: VideoUtilities;
  paths: PathsType;
  extraResources = (isPackaged) ? join(app.getAppPath(), '') : join(app.getAppPath(), '../assets');

  constructor() {
    this.video = new VideoUtilities();
    this.paths = {
      osnFolder: join(this.extraResources, '/osn-data'),
      screensFolder: join(this.extraResources, '/Screens'),
      appFolder: join(this.extraResources, '/appDatas'),
      sponsorsFolder: join(this.extraResources, '/sponsors'),
      playersFolder: join(this.extraResources, '/players'),
    };
  }

  static getExtension = (filename: string): string => {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }
}

export { Utilities };