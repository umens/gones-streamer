 import React from "react";
import './VuMeter.css';

type VuMeterProps = {
  volume: number;
  muted: boolean;
  peaks: number[][] | number[]
  label: string;
};
type VuMeterState = {
};
class VuMeter extends React.Component<VuMeterProps, VuMeterState> {

  private _frameId: number = 0;
  private _id: string = 'vumeter_' + Math.round(Math.random() * 100);

  // Settings
  max             = 100;
  boxCount        = 10;
  boxCountRed     = 2;
  boxCountYellow  = 3;
  boxGapFraction  = 0.2;
  jitter          = 0.02;

  // Colours
  redOn     = 'rgba(255,47,30,0.9)';
  redOff    = 'rgba(64,12,8,0.9)';
  yellowOn  = 'rgba(255,215,5,0.9)';
  yellowOff = 'rgba(64,53,0,0.9)';
  greenOn   = 'rgba(53,255,30,0.9)';
  greenOff  = 'rgba(13,64,8,0.9)';

  // Derived and starting values
  elem: HTMLCanvasElement | null = null;
  width: number = 30;
  height: number = 200;
  curVal = 0;

  // Gap between boxes and box height
  boxHeight: number = 0;
  boxGapY: number = 0;

  boxWidth: number = 0;
  boxGapX: number = 0;

  // Canvas starting state
  c: CanvasRenderingContext2D | null = null;

  constructor(props: Readonly<VuMeterProps>) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    // Derived and starting values
    this.elem = document.getElementById(this._id) as HTMLCanvasElement;
    this.width = this.elem.width || 30;
    this.height = this.elem.height || 200;

    // Gap between boxes and box height
    this.boxHeight = this.height / (this.boxCount + (this.boxCount + 1) * this.boxGapFraction);
    this.boxGapY = this.boxHeight * this.boxGapFraction;

    this.boxWidth = this.width - (this.boxGapY * 2);
    this.boxGapX = (this.width - this.boxWidth) / 2;

    // Canvas starting state
    this.c = this.elem.getContext('2d');

    this.startLoop();
  }
  
  componentWillUnmount = () => {
    this.stopLoop();
  }
  
  startLoop = () => {
    if( !this._frameId ) {
      this._frameId = window.requestAnimationFrame( this.loop );
    }
  }
  
  loop = () => {
    // perform loop work here
    this.draw()
    
    // Set up next iteration of the loop
    this._frameId = window.requestAnimationFrame( this.loop )
  }
  
  stopLoop = () => {
    window.cancelAnimationFrame( this._frameId );
    // Note: no need to worry if the loop has already been cancelled
    // cancelAnimationFrame() won't throw an error
  }

  draw = () => {

    var targetVal = (this.props.peaks.length !== 0 && Array.isArray(this.props.peaks[0])) ? this.props.peaks[0][1] as number || 0 : this.props.peaks[1] as number || 0;
// console.log((this.props.peaks.length !== 0 && Array.isArray(this.props.peaks[0])) ? this.props.peaks[0] : this.props.peaks)
//     console.log(this._id +' - '+targetVal)
    targetVal = targetVal * 100 * 5;
    // Gradual approach
    if (this.curVal <= targetVal){
      this.curVal += (targetVal - this.curVal) / 5;
    } else {
      this.curVal -= (this.curVal - targetVal) / 5;
    }

    // Apply jitter
    if (this.jitter > 0 && this.curVal > 0){
        var amount = (Math.random() * this.jitter * this.max);
        if (Math.random() > 0.5){
            amount = -amount;
        }
        this.curVal += amount;
    }
    if (this.curVal < 0) {
      this.curVal = 0;
    }

    if(this.c) {
      this.c.save();
      this.c.beginPath();
      this.c.rect(0, 0, this.width, this.height);
      this.c.fillStyle = 'rgb(32,32,32)';
      this.c.fill();
      this.c.restore();
      this.drawBoxes(this.c, this.curVal);
    }
  };

  drawBoxes = (c: CanvasRenderingContext2D, val: number) => {
    c.save(); 
    c.translate(this.boxGapX, this.boxGapY);
    for (var i = 0; i < this.boxCount; i++){
        var id = this.getId(i);

        c.beginPath();
        if (this.isOn(id, val)){
            c.shadowBlur = 10;
            c.shadowColor = this.getBoxColor(id, val);
        }
        c.rect(0, 0, this.boxWidth, this.boxHeight);
        c.fillStyle = this.getBoxColor(id, val);
        c.fill();
        c.translate(0, this.boxHeight + this.boxGapY);
    }
    c.restore();
  }

  // Get the color of a box given it's ID and the current value
  getBoxColor = (id: number, val: number) => {
    // on colours
    if (id > this.boxCount - this.boxCountRed){
        return this.isOn(id, val)? this.redOn : this.redOff;
    }
    if (id > this.boxCount - this.boxCountRed - this.boxCountYellow){
        return this.isOn(id, val)? this.yellowOn : this.yellowOff;
    }
    return this.isOn(id, val)? this.greenOn : this.greenOff;
}

  getId = (index: number) => {
    // The ids are flipped, so zero is at the top and
    // boxCount-1 is at the bottom. The values work
    // the other way around, so align them first to
    // make things easier to think about.
    return Math.abs(index - (this.boxCount - 1)) + 1;
  }

  isOn = (id:number, val: number) => {
    // We need to scale the input value (0-max)
    // so that it fits into the number of boxes
    var maxOn = Math.ceil((val / this.max) * this.boxCount);
    return (id <= maxOn);
  }
  
  render = () => {
    return (
      <>
        <section className="main">
          <canvas id={this._id} width="30" height="200">No canvas</canvas>
        </section>
      </>
    );
  }
};

export { VuMeter };
