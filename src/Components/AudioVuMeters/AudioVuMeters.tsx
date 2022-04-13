 import React from "react";
import { IObsRemote } from "..";
import './AudioVuMeters.css';
import { VuMeter } from "../VuMeter/VuMeter";

type AudioSource = {
  label: string;
  peaks: number[] | [number[]];
  volume: number;
  muted: boolean;
}

type AudioVuMetersProps = {
  ObsRemote: IObsRemote;
};
type AudioVuMetersState = {
  initVolumeters: boolean;
  audioSources: AudioSource[];
};
class AudioVuMeters extends React.Component<AudioVuMetersProps, AudioVuMetersState> {

  constructor(props: Readonly<AudioVuMetersProps>) {
    super(props);
    this.state = {
      initVolumeters: true,
      audioSources: [],
    };
  }

  handleVolumeterEvent = async (event: any): Promise<void> => {
    let audioSources = this.state.audioSources;
    if(this.state.initVolumeters) {
      event.inputs.forEach(async (input: any) => {
        let audioSource: AudioSource = {
          label: input.inputName,
          peaks: input.inputLevelsMul,
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
          audioSources[tmpAudioSourceIndex].peaks = input.inputLevelsMul;
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
  
  render() {
    return (
      <>
      <p>{ this.state.audioSources.length }</p>
      { this.state.audioSources.map((audioSource, i) =>
        <VuMeter key={`vumeter-${ i }`} muted={audioSource.muted} volume={audioSource.volume} label={audioSource.label} peaks={audioSource.peaks} />
      )}
        {/* <VuMeter value={45}/> */}
      </>
      // <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
      //   <Col span={12}>
      //   </Col>
      //   <Col span={12}>
      //   </Col>
      // </Row>
    );
  }
};

export { AudioVuMeters };
