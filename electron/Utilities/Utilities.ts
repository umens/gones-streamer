import { VideoUtilities } from "./VideoUtilities";

class Utilities {

  video: VideoUtilities;

  constructor() {
    this.video = new VideoUtilities();
  }

  static getExtension = (filename: string): string => {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }

}

export { Utilities };