export class OBSStats {
  /**
   * Current framerate.
   */
  fps: number;
  /**
   * Number of frames rendered
   */
  renderTotalFrames: number;
  /**
   * Number of frames missed due to rendering lag
   */
  renderMissedFrames: number;
  /**
   * Number of frames outputted
   */
  outputTotalFrames: number;
  /**
   * Number of frames skipped due to encoding lag
   */
  outputSkippedFrames: number;
  /**
   * Average frame render time (in milliseconds)
   */
  averageFrameTime: number;
  /**
   * Current CPU usage (percentage)
   */
  cpuUsage: number;
  /**
   * Current RAM usage (in megabytes)
   */
  memoryUsage: number;
  /**
   * Free recording disk space (in megabytes)
   */
  freeDiskSpace: number;

  /**
   * Creates an instance of OBSStats.
   */
  constructor(obj: any) {
    this.fps = obj.fps;
    this.renderTotalFrames = obj['render-total-frames'];
    this.renderMissedFrames = obj['render-missed-frames'];
    this.outputTotalFrames = obj['output-total-frames'];
    this.outputSkippedFrames = obj['output-skipped-frames'];
    this.averageFrameTime = obj['average-frame-time'];
    this.cpuUsage = obj['cpu-usage'];
    this.memoryUsage = obj['memory-usage'];
    this.freeDiskSpace = obj['free-disk-space'];
  }
}
