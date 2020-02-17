interface ILiveSettings {
  bitrate: number;
  buffer: number;
  streamKey: string;
}

export class LiveSettings {
  /**
   * obs bitrate settings
   */
  bitrate: number;
  /**
   * obs buffer settings
   */
  buffer: number;
  /**
   * obs streamKey settings
   */
  streamKey: string;

  /**
   * Creates an instance of LiveSettings.
   */
  constructor(values: ILiveSettings) {
    this.bitrate = 6000;
    this.buffer = 15;
    this.streamKey = '';
    Object.assign(this, values);
  }
}
