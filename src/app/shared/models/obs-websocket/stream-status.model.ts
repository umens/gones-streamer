import { OBSStats } from './obsstats.model';

export class StreamStatus extends OBSStats {
  /**
   * Current streaming state.
   */
  streaming: boolean;
  /**
   * Current recording state.
   */
  recording: boolean;
  /**
   * Replay Buffer status
   */
  replayBufferActive: boolean;
  /**
   * Amount of data per second (in bytes) transmitted by the stream encoder.
   */
  bytesPerSec: number;
  /**
   * Amount of data per second (in kilobits) transmitted by the stream encoder.
   */
  kbitsPerSec: number;
  /**
   * Percentage of dropped frames.
   */
  strain: number;
  /**
   * Total time (in seconds) since the stream started.
   */
  totalStreamTime: number;
  /**
   * Total number of frames transmitted since the stream started.
   */
  numTotalFrames: number;
  /**
   * Number of frames dropped by the encoder since the stream started.
   */
  numDroppedFrames: number;
  /**
   * Always false (retrocompatibility).
   */
  previewOnly: boolean;

  constructor(obj: any) {
    super(obj);
    this.streaming = obj.streaming;
    this.recording = obj.recording;
    this.replayBufferActive = obj['replay-buffer-active'];
    this.bytesPerSec = obj['bytes-per-sec'];
    this.kbitsPerSec = obj['kbits-per-sec'];
    this.strain = obj.strain;
    this.totalStreamTime = obj['total-stream-time'];
    this.numTotalFrames = obj['num-total-frames'];
    this.numDroppedFrames = obj['num-dropped-frames'];
  }
}
