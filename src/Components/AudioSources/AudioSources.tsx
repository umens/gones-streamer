 import React from "react";
import { IObsRemote } from "..";
import { VuMeter } from "../VuMeter/VuMeter";
import { IVolmeter } from "../../Models";
import './AudioSources.css';
import { Card } from "antd";

type AudioSource = {
  label: string;
  peaks: IVolmeter;
  volume: number;
  muted: boolean;
}

type AudioSourcesProps = {
  ObsRemote: IObsRemote;
};
type AudioSourcesState = {
  initVolumeters: boolean;
  audioSources: AudioSource[];
};
class AudioSources extends React.Component<AudioSourcesProps, AudioSourcesState> {

  constructor(props: Readonly<AudioSourcesProps>) {
    super(props);
    this.state = {
      initVolumeters: true,
      audioSources: [],
    };
  }

  tranformPeaksArray = (inputLevelsMul: number[][] | number[]): IVolmeter => {
    if(inputLevelsMul.length > 0) {
      let data: IVolmeter = { magnitude: [], peak: [], inputPeak: [] };
      if(Array.isArray(inputLevelsMul[0])) {
        data.magnitude =  (inputLevelsMul as number[][]).map(function(x: number[]) {
          return x[0] ? x[0] : 0;
        });
        data.peak = (inputLevelsMul as number[][]).map(function(x: number[]) {
          return x[1] ? x[1] : 0;
        });
        data.inputPeak = (inputLevelsMul as number[][]).map(function(x: number[]) {
          return x[2] ? x[2] : 0;
        });
      } else {
        data = {
          magnitude: (inputLevelsMul as number[])[0] ? [(inputLevelsMul as number[])[0]] : [0],
          peak: (inputLevelsMul as number[])[1] ? [(inputLevelsMul as number[])[1]] : [0],
          inputPeak: (inputLevelsMul as number[])[2] ? [(inputLevelsMul as number[])[2]] : [0],
        }
      }
      return data;
    }
    else {
      return { 
        magnitude: [0],
        peak: [0],
        inputPeak: [0],
      };
    }
  }

  handleVolumeterEvent = async (event: any): Promise<void> => {
    if(this.state.audioSources.length !== event.inputs.length) {
      await this.setState({ initVolumeters: true, audioSources: []});
    }
    let audioSources = this.state.audioSources;
    if(this.state.initVolumeters) {
      event.inputs.forEach(async (input: any) => {
        let audioSource: AudioSource = {
          label: input.inputName,
          peaks: this.tranformPeaksArray(input.inputLevelsMul),
          muted: await this.props.ObsRemote.getMuteStateFromInput(input.inputName),
          volume: await this.props.ObsRemote.getVolumeFromInput(input.inputName),
        };
        audioSources.push(audioSource);
      });
      await this.setState({ initVolumeters: false });
    }
    if(event.inputs.length > 0 && audioSources.length > 0) {
      event.inputs.forEach(async (input: any) => {
        let tmpAudioSourceIndex = audioSources.findIndex(item => item.label === input.inputName);
        if(tmpAudioSourceIndex > -1) {
          audioSources[tmpAudioSourceIndex].peaks = this.tranformPeaksArray(input.inputLevelsMul);
        }
      });
      await this.setState({ audioSources });
    }
  }

  handleMutedStateEvent = async (event: any): Promise<void> => {
    let audioSources = this.state.audioSources;
    let tmpAudioSourceIndex = audioSources.findIndex(item => item.label === event.inputName);
    if(tmpAudioSourceIndex > -1) {
      audioSources[tmpAudioSourceIndex].muted = event.inputMuted;
      await this.setState({ audioSources });
    }
  }

  handleVolumeChangedEvent = async (event: any): Promise<void> => {
    let audioSources = this.state.audioSources;
    let tmpAudioSourceIndex = audioSources.findIndex(item => item.label === event.inputName);
    if(tmpAudioSourceIndex > -1) {
      audioSources[tmpAudioSourceIndex].volume = event.inputVolumeDb;
      await this.setState({ audioSources });
    }
  }

  componentDidMount = async () => {
    try {
      this.props.ObsRemote.startListenerVolumeter(this.handleVolumeterEvent);
      
      this.props.ObsRemote.startListenerMutedState(this.handleMutedStateEvent);
      this.props.ObsRemote.startListenerVolumeChanged(this.handleVolumeChangedEvent);

      // setTimeout(() => {
      //   this.props.ObsRemote.stopListenerVolumeter();
      // }, 500);
    } catch (error) {

    }
  }

  componentWillUnmount = () => {    
    this.props.ObsRemote.stopListenerVolumeter();
    this.props.ObsRemote.stopListenerMutedState();
    this.props.ObsRemote.stopListenerVolumeChanged();
  }

  toggleMute = async (channel: string) => {
    try {
      await this.props.ObsRemote.toggleMute(channel);
    } catch (error) {
      console.log(error); 
    }
  }

  changeVolume = async (volume: number, channel: string) => {
    try {
      await this.props.ObsRemote.changeVolume(volume, channel);
    } catch (error) {
      console.log(error); 
    }
  }
  
  render() {
    return (
      <Card title="Audio">
      { this.state.audioSources.map((audioSource, i) =>
        <VuMeter key={`vumeter-${ i }`} canvasId={i} muted={audioSource.muted} volume={audioSource.volume} label={audioSource.label} peaks={audioSource.peaks} toggleMute={async (channel) => await this.toggleMute(channel)} changeVolume={async (volume) => await this.changeVolume(volume, audioSource.label)}/>
      )}
      </Card>
    );
  }
};

export { AudioSources };
