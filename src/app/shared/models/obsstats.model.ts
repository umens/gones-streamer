export class OBSStats {
  /**
   * Current framerate.
   */
  fps: number;
  /**
   * Number of frames rendered
   */
  'render-total-frames': number;
  /**
   * Number of frames missed due to rendering lag
   */
  'render-missed-frames': number;
  /**
   * Number of frames outputted
   */
  'output-total-frames': number;
  /**
   * Number of frames skipped due to encoding lag
   */
  'output-skipped-frames': number;
  /**
   * Average frame render time (in milliseconds)
   */
  'average-frame-time': number;
  /**
   * Current CPU usage (percentage)
   */
  'cpu-usage': number;
  /**
   * Current RAM usage (in megabytes)
   */
  'memory-usage': number;
  /**
   * Free recording disk space (in megabytes)
   */
  'free-disk-space': number;
}
