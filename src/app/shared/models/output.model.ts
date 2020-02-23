export class Output {
  /**
   * Output name
   */
  name: string;
  /**
   * Output type/kind
   */
  type: string;
  /**
   * Video output width
   */
  width: number;
  /**
   * Video output height
   */
  height: number;
  /**
   * Output flags
   */
  flags: {
    /**
     * Raw flags value
     */
    rawValue: number;
    /**
     * Output uses audio
     */
    audio: boolean;
    /**
     * Output uses video
     */
    video: boolean;
    /**
     * Output is encoded
     */
    encoded: boolean;
    /**
     * Output uses several audio tracks
     */
    multiTrack: boolean;
    /**
     * Output uses a service
     */
    service: boolean;
  };
  /**
   * Output name
   */
  settings: string;
  /**
   * Output status (active or not)
   */
  active: boolean;
  /**
   * Output reconnection status (reconnecting or not)
   */
  reconnecting: boolean;
  /**
   * Output congestion
   */
  congestion: number;
  /**
   * Number of frames sent
   */
  totalFrames: number;
  /**
   * Number of frames dropped
   */
  droppedFrames: number;
  /**
   * Total bytes sent
   */
  totalBytes: number;
}
