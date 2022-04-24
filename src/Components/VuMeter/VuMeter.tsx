import React, { createRef, RefObject } from "react";
import Icon from "@ant-design/icons";
import { IVolmeter } from "../../Models";
import './VuMeter.css';
import { Slider, Tooltip } from "antd";

const MuteSpeakerSvg = () => (
  <svg height="1em" fill="currentColor" viewBox="0 0 100 100" width="1em">
    <path d="M49.6,24.1a4.1,4.1,0,0,0-4.1.8L31.6,38.8H22a3.8,3.8,0,0,0-3.8,3.7v15A3.8,3.8,0,0,0,22,61.2h9.6L45.5,75.1a4.1,4.1,0,0,0,4.1.8,3.8,3.8,0,0,0,2.3-3.5V27.6A3.8,3.8,0,0,0,49.6,24.1Z" fillRule="evenodd">
    </path>
    <path d="M75.8,50l4.9-4.8a3.9,3.9,0,0,0,0-5.3,3.7,3.7,0,0,0-5.3,0l-4.9,4.8-4.8-4.8a3.7,3.7,0,0,0-5.3,0,3.9,3.9,0,0,0,0,5.3L65.3,50l-4.9,4.8a3.9,3.9,0,0,0,0,5.3,3.7,3.7,0,0,0,5.3,0l4.8-4.8,4.9,4.8a3.7,3.7,0,0,0,5.3,0,3.9,3.9,0,0,0,0-5.3Z" fillRule="evenodd">
    </path>
  </svg>
);
const MuteSpeakerIcon = (props: any) => <Icon component={MuteSpeakerSvg} {...props} />;

const OnSpeakerSvg = () => (
  <svg height="1em" fill="currentColor" viewBox="0 0 100 100" width="1em">
    <path d="M47.8,25.8a3.6,3.6,0,0,0-3.8.8L31.1,39.5H22A3.5,3.5,0,0,0,18.5,43V57A3.5,3.5,0,0,0,22,60.5h9.1L44,73.4a3.6,3.6,0,0,0,3.8.8A3.5,3.5,0,0,0,50,71V29A3.5,3.5,0,0,0,47.8,25.8Z">
    </path>
    <path d="M65.7,41.6a18.8,18.8,0,0,0-4.4-6.4,3.5,3.5,0,0,0-4.9,4.9,14.2,14.2,0,0,1,2.9,4.3A13.1,13.1,0,0,1,60.5,50a14,14,0,0,1-4.1,9.9,3.5,3.5,0,0,0,4.9,4.9A20.9,20.9,0,0,0,67.5,50,19.8,19.8,0,0,0,65.7,41.6Z">
    </path>
    <path d="M71.2,25.3a3.5,3.5,0,0,0-4.9,4.9,28,28,0,0,1,0,39.6,3.5,3.5,0,0,0,4.9,4.9,34.8,34.8,0,0,0,0-49.4Z">
    </path>
  </svg>
);
const OnSpeakerIcon = (props: any) => <Icon component={OnSpeakerSvg} {...props} />;

// Configuration
const CHANNEL_HEIGHT = 3;
const PADDING_HEIGHT = 2;
const PEAK_WIDTH = 4;
const PEAK_HOLD_CYCLES = 100;
const WARNING_LEVEL = -20;
const DANGER_LEVEL = -9;

// Colors (RGB)
// BG
const BG_GREEN = [26, 127, 26];
const BG_YELLOW = [127, 127, 26];
const BG_RED = [127, 26, 26];
// FG
const FG_GREEN = [76, 255, 76];
const FG_YELLOW = [255, 255, 76];
const FG_RED = [255, 76, 76];

// Disabled Colors
// Disabled BG
const DISABLE_BG_GREEN = [90, 90, 90];
const DISABLE_BG_YELLOW = [117, 117, 117];
const DISABLE_BG_RED = [65, 65, 65];
// Disabled FG
const DISABLE_FG_GREEN = [163, 163, 163];
const DISABLE_FG_YELLOW = [217, 217, 217];
const DISABLE_FG_RED = [113, 113, 113];

// Ticks
const TICK = [255, 255, 255];
const MINOR_TICK = [204, 204, 204];

const FPS_LIMIT = 40;
// const DECAY_RATE = 11.76;

type VuMeterProps = {
  volume: number;
  muted: boolean;
  peaks: IVolmeter
  label: string;
  canvasId: number;
  toggleMute: (channel: string) => void;
  changeVolume: (volume: number) => void;  
};
type VuMeterState = {
  volumeInput: number;
};
class VuMeter extends React.Component<VuMeterProps, VuMeterState> {

  // canvasRef = useRef(null);
  canvas: RefObject<HTMLCanvasElement>;
  sliderRef: RefObject<HTMLInputElement>;
  // canvas: HTMLCanvasElement;
  // Used for Canvas 2D rendering
  ctx: CanvasRenderingContext2D | null;

  peakHoldCounters: number[];
  peakHolds: number[];

  canvasWidth: number | null;
  canvasWidthInterval?: number;
  channelCount: number | null;
  canvasHeight: number | null;


  // Used to force recreation of the canvas element
  // canvasId = 1;

  // Used for lazy initialization of the canvas rendering
  renderingInitialized = false;

  // Current peak values
  currentPeaks?: number[];
  // Store prevPeaks and interpolatedPeaks values for smooth interpolated rendering
  prevPeaks?: number[];
  interpolatedPeaks?: number[];
  // the time of last received peaks
  lastEventTime?: number;
  // time between 2 received peaks.
  // Used to render extra interpolated frames
  interpolationTime = 35;
  bg?: { r: number; g: number; b: number };

  firstFrameTime?: number;
  frameNumber?: number;
  volmetersEnabled = true;
  onRenderingInit?: () => void;
  // lastRedraw: number = window.performance.now();

  constructor(props: Readonly<VuMeterProps>) {
    super(props);
    this.state = {
      volumeInput: this.props.volume,
    };
    this.sliderRef = createRef<HTMLInputElement>();
    this.canvas = createRef<HTMLCanvasElement>();
    this.ctx = null;
    this.canvasWidth = null;
    this.channelCount = null;
    this.canvasHeight = null;
    this.peakHoldCounters = [];
    this.peakHolds = [];

    this.setupNewCanvas();
  }

  componentDidMount = async () => {
    this.setupNewCanvas();

    // this.startLoop();
  }

  getSnapshotBeforeUpdate = (prevProps: Readonly<VuMeterProps>, prevState: Readonly<VuMeterState>): any => {
    if (prevProps.volume !== this.props.volume) {
      this.setState({ volumeInput: this.props.volume });
    }
    if (this.canvas) {
      // don't init context for inactive sources
      if (!this.props.peaks.peak.length && !this.renderingInitialized) return null;

      this.initRenderingContext();
      this.setChannelCount(this.props.peaks.peak.length);

      // save peaks value to render it in the next animationFrame
      this.prevPeaks = this.interpolatedPeaks;
      this.currentPeaks = Array.from(this.props.peaks.peak);
      this.lastEventTime = performance.now();
    }
    return null;
  }

  componentDidUpdate = (prevProps: Readonly<VuMeterProps>, prevState: Readonly<VuMeterState>): any => { 
    // if (prevProps.volume !== this.props.volume) {
    //   this.setState({ volumeInput: this.props.volume });
    // }
  }
  
  componentWillUnmount = () => {
    if(this.canvasWidthInterval) {
      clearInterval(this.canvasWidthInterval);
    }
    // this.stopLoop();
  }

  setupNewCanvas = () => {
    // Make sure all state is cleared out
    this.ctx = null;
    this.canvasWidth = null;
    this.channelCount = null;
    this.canvasHeight = null;

    this.renderingInitialized = false;

    // Assume 2 channels until we know otherwise. This prevents too much
    // visual jank as the volmeters are initializing.
    this.setChannelCount(2);
    
    this.setCanvasWidth();

    this.canvasWidthInterval = window.setInterval(() => this.setCanvasWidth(), 500);
    if (this.volmetersEnabled) {
      requestAnimationFrame(t => this.onRequestAnimationFrameHandler(t));
    }
  }

  /**
   * Render volmeters with FPS capping
   */
  private onRequestAnimationFrameHandler(now: DOMHighResTimeStamp) {
    // init first rendering frame
    if (!this.frameNumber) {
      this.frameNumber = -1;
      this.firstFrameTime = now;
    }

    const timeElapsed = now - this.firstFrameTime!;
    const timeBetweenFrames = 1000 / FPS_LIMIT;
    const currentFrameNumber = Math.ceil(timeElapsed / timeBetweenFrames);
    // this.lastRedraw = window.performance.now();
    

    if (currentFrameNumber !== this.frameNumber) {
      // it's time to render next frame
      this.frameNumber = currentFrameNumber;
      // don't render sources then channelsCount is 0
      // happens when the browser source stops playing audio
      if (this.renderingInitialized && this.currentPeaks && this.currentPeaks.length) {

        // if(this.currentPeaks) {          
        //   // smooth the decay of peak
        //   const decay = DECAY_RATE * ((window.performance.now() - this.lastRedraw) * 0.000000001);
        //   this.currentPeaks!.forEach((element, i) => {
        //     const peakHold = this.peakHolds[i] ? this.peakHolds[i] : 0;
        //     this.currentPeaks![i] = ((peakHold - decay) < this.currentPeaks![i] ? this.currentPeaks![i] : ((peakHold - decay) > 0 ? 0 : (peakHold - decay)))
        //   });
        // }

        this.drawVolmeterC2d(this.currentPeaks);
      }
    }
    requestAnimationFrame(t => this.onRequestAnimationFrameHandler(t));
  }

  private initRenderingContext() {
    if (this.renderingInitialized) return;
    if (!this.volmetersEnabled) return;

    if(this.canvas.current) {
      this.ctx = this.canvas.current.getContext('2d', { alpha: false });
      // this.ctx?.scale(0.75, 0.75);
      this.renderingInitialized = true;
      if (this.onRenderingInit) this.onRenderingInit();
    }
  }

  private setChannelCount(channels: number) {
    if (channels !== this.channelCount) {
      this.channelCount = channels;
      this.canvasHeight = Math.max(
        channels * (CHANNEL_HEIGHT + PADDING_HEIGHT) - PADDING_HEIGHT + 14,
        0,
      );


      if(this.canvas.current) {
        this.canvas.current.height = this.canvasHeight;
        this.canvas.current.style.height = `${this.canvasHeight}px`;
        // if (this.spacer) this.spacer.style.height = `${this.canvasHeight}px`;
      } 
      else {
        return;
      }
    }
  }

  private setCanvasWidth() {
    if (this.canvas.current) {
      
      const containerWidth = document.getElementById(`canvas-${this.props.canvasId}`)!.offsetWidth;
      const width = Math.floor(containerWidth);

      if (width !== this.canvasWidth && this.canvas.current) {
        this.canvasWidth = width;
        this.canvas.current.width = width;
        this.canvas.current.style.width = `${width}px`;
      }
      this.bg = {b: 20, r: 20, g: 20};
    }
  }

  private getBgMultiplier() {
    // Volmeter backgrounds appear brighter against a darker background
    return 0.2;
  }

  private drawVolmeterC2d(peaks: number[]) {
    if (this.canvasWidth! < 0 || this.canvasHeight! < 0) return;

    const bg = {b: 20, r: 20, g: 20};
    if(this.ctx && this.canvasWidth && this.canvasHeight) {
      this.ctx.fillStyle = this.rgbToCss([bg.r, bg.g, bg.b]);
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      const y = peaks.length > 1 ? (peaks.length * CHANNEL_HEIGHT) + PADDING_HEIGHT : CHANNEL_HEIGHT;
      this.paintHTicks(0, y, this.canvasWidth);
  
      peaks.forEach((peak, channel) => {
        this.drawVolmeterChannelC2d(peak, channel);
      });
    }
  }

  private drawVolmeterChannelC2d(peak: number, channel: number) {
    peak = (peak === 0) ? -100 : (20 * Math.log10(peak));

    this.updatePeakHold(peak, channel);

    if(this.ctx) {

      const heightOffset = channel * (CHANNEL_HEIGHT + PADDING_HEIGHT);
      const warningPx = this.dbToPx(WARNING_LEVEL);
      const dangerPx = this.dbToPx(DANGER_LEVEL);
  
      // const bgMultiplier = this.getBgMultiplier();
  
      // Background
      // this.ctx.fillStyle = this.rgbToCss(GREEN, bgMultiplier);
      this.ctx.fillStyle = this.props.muted ? this.rgbToCss(DISABLE_BG_GREEN) : this.rgbToCss(BG_GREEN);
      this.ctx.fillRect(0, heightOffset, warningPx, CHANNEL_HEIGHT);
      // this.ctx.fillStyle = this.rgbToCss(YELLOW, bgMultiplier);
      this.ctx.fillStyle = this.props.muted ? this.rgbToCss(DISABLE_BG_YELLOW) : this.rgbToCss(BG_YELLOW);
      this.ctx.fillRect(warningPx, heightOffset, dangerPx - warningPx, CHANNEL_HEIGHT);
      // this.ctx.fillStyle = this.rgbToCss(RED, bgMultiplier);
      this.ctx.fillStyle = this.props.muted ? this.rgbToCss(DISABLE_BG_RED) : this.rgbToCss(BG_RED);
      this.ctx.fillRect(dangerPx, heightOffset, this.canvasWidth! - dangerPx, CHANNEL_HEIGHT);
  
      const peakPx = this.dbToPx(peak);
  
      const greenLevel = Math.min(peakPx, warningPx);
      // this.ctx.fillStyle = this.rgbToCss(GREEN);
      this.ctx.fillStyle = this.props.muted ? this.rgbToCss(DISABLE_FG_GREEN) : this.rgbToCss(FG_GREEN);
      this.ctx.fillRect(0, heightOffset, greenLevel, CHANNEL_HEIGHT);
  
      if (peak > WARNING_LEVEL) {
        const yellowLevel = Math.min(peakPx, dangerPx);
        // this.ctx.fillStyle = this.rgbToCss(YELLOW);
        this.ctx.fillStyle = this.props.muted ? this.rgbToCss(DISABLE_FG_YELLOW) : this.rgbToCss(FG_YELLOW);
        this.ctx.fillRect(warningPx, heightOffset, yellowLevel - warningPx, CHANNEL_HEIGHT);
      }
  
      if (peak > DANGER_LEVEL) {
        // this.ctx.fillStyle = this.rgbToCss(RED);
        this.ctx.fillStyle = this.props.muted ? this.rgbToCss(DISABLE_FG_RED) : this.rgbToCss(FG_RED);
        this.ctx.fillRect(dangerPx, heightOffset, peakPx - dangerPx, CHANNEL_HEIGHT);
      }
  
      // this.ctx.fillStyle = this.rgbToCss(GREEN);
      // if (this.peakHolds[channel] > WARNING_LEVEL) this.ctx.fillStyle = this.rgbToCss(YELLOW);
      // if (this.peakHolds[channel] > DANGER_LEVEL) this.ctx.fillStyle = this.rgbToCss(RED);

      this.ctx.fillStyle = this.props.muted ? this.rgbToCss(DISABLE_FG_GREEN) : this.rgbToCss(FG_GREEN);
      if (this.peakHolds[channel] > WARNING_LEVEL) this.ctx.fillStyle = this.props.muted ? this.rgbToCss(DISABLE_FG_YELLOW) : this.rgbToCss(FG_YELLOW);
      if (this.peakHolds[channel] > WARNING_LEVEL) this.ctx.fillStyle = this.props.muted ? this.rgbToCss(DISABLE_FG_RED) : this.rgbToCss(FG_RED);
      
      this.ctx.fillRect(
        this.dbToPx(this.peakHolds[channel]),
        heightOffset,
        PEAK_WIDTH,
        CHANNEL_HEIGHT,
      );
    }
  }

  private dbToPx(db: number) {
    return Math.round((db + 60) * (this.canvasWidth! / 60));
  }

  /**
   * Converts RGB components into a CSS string, and optionally applies
   * a multiplier to lighten or darken the color without changing its hue.
   * @param rgb An array containing the RGB values from 0-255
   * @param multiplier A multiplier to lighten or darken the color
   */
  private rgbToCss(rgb: number[], multiplier = 1) {
    return `rgb(${rgb.map(v => Math.round(v * multiplier)).join(',')})`;
  }
  private convertRGBtoHex = (rgb: number[]): string => {
    return "#" + this.colorToHex(rgb[0]) + this.colorToHex(rgb[1]) + this.colorToHex(rgb[2]);
  }
  private colorToHex = (color: number): string => {
    var hexadecimal = color.toString(16);
    return hexadecimal.length === 1 ? "0" + hexadecimal : hexadecimal;
  }
  
  updatePeakHold(peak: number, channel: number) {
    if (!this.peakHoldCounters[channel] || peak > this.peakHolds[channel]) {
      this.peakHolds[channel] = peak;
      this.peakHoldCounters[channel] = PEAK_HOLD_CYCLES;
      return;
    }

    this.peakHoldCounters[channel] -= 1;
  }

  paintHTicks = (x: number, y: number, width: number) => {
    if(this.ctx) {
      const scale = width / 60;

      // Draw major tick lines and numeric indicators.
      for (let i = 0; i <= 60; i += 5) {
        let position = Math.round(x + (i * scale) - 1);
        let str = (i - 60).toString();
        let pos = 0;
        if (i === 60) {
          pos = position - this.ctx.measureText(str).width;
        } else {
          pos = position - (this.ctx.measureText(str).width / 2) - 2;
          if (pos < 0)
            pos = 0;
        }

        // Text value at that point
        this.ctx.font = '8px Arial';
        this.ctx.fillStyle = this.convertRGBtoHex(TICK);
        this.ctx.textAlign = 'start';
        this.ctx.fillText(str, pos, y + 14);

        // Draw a tick mark
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.convertRGBtoHex(TICK);

        this.ctx.moveTo(position < 0 ? 0 : position, y);
        this.ctx.lineTo(position < 0 ? 0 : position, y + 6);
        this.ctx.stroke();
        
      }

      // Draw minor tick lines.
      for (let i = 0; i <= 60; i++) {
        let position = Math.round(x + (i * scale) - 1);
        if (i % 5 !== 0) {
          // Draw a tick mark
          this.ctx.beginPath();
          this.ctx.lineWidth = 1;
          this.ctx.strokeStyle = this.convertRGBtoHex(MINOR_TICK);
  
          this.ctx.moveTo(position < 0 ? 0 : position, y);
          this.ctx.lineTo(position < 0 ? 0 : position, y + 3);
          this.ctx.stroke();
        }
      }
    }
  }
  
  render = () => {
    return (
      <div className="volmeter-container" id={`canvas-${this.props.canvasId}`}>
        <p style={{ marginBottom: 0 }}>
          { this.props.muted && <><Tooltip title="Unmute channel"><MuteSpeakerIcon style={{ color: 'red', verticalAlign: 'bottom', fontSize: '1.5em' }} onClick={(e: any) => this.props.toggleMute(this.props.label)}/></Tooltip> { this.props.label }</> }
          { !this.props.muted && <><Tooltip title="Mute channel"><OnSpeakerIcon style={{ verticalAlign: 'bottom', fontSize: '1.5em' }} onClick={(e: any) => this.props.toggleMute(this.props.label)}/></Tooltip> { this.props.label }</> }
          <span style={{ float: 'right', fontSize: '0.6em', paddingTop: 7 }}>{ this.props.volume > -96 ? this.props.volume.toFixed(1) : '-Inf' } dB</span>
        </p>
        <canvas className="volmeter" ref={this.canvas} />
        <Slider style={{ marginTop: 3, marginBottom: 3 }} defaultValue={this.props.volume} value={this.state.volumeInput} min={-100} max={0} step={0.1} onChange={(value) => this.setState({ volumeInput: value})} onAfterChange={(value) => this.props.changeVolume(value)} />
        <div className="volmeter-spacer" />
      </div>
    );
  }
};

export { VuMeter };
