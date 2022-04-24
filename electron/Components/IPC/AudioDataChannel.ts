import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainInvokeEvent } from 'electron';
import { AudioHardware, GetDefaultConfig, IpcRequest, StoreType } from "../../../src/Models";
import ElectronLog from "electron-log";
import Store from 'electron-store';

export class AudioDataChannel implements IpcChannelInterface {

  log: ElectronLog.LogFunctions;
  store: Store<StoreType> = new Store<StoreType>({
		defaults: GetDefaultConfig()
  });

  constructor() {
    this.log = ElectronLog.scope('AudioDataChannel');
  }

  getName(): string {
    return 'audio-data';
  }

  async handle(event: IpcMainInvokeEvent, request: IpcRequest): Promise<AudioHardware[]> {
    let audios: AudioHardware[] = [];
    try {
      if(request.params && request.params.action) {        
        switch (request.params.action) {
          case 'add':
            if(request.params.audio) {
              let audio = request.params.audio as AudioHardware;
              audios = this.store.get('AudioHardware');
              audios.push(audio);
              this.store.set('AudioHardware', audios);
              // event.sender.send(request.responseChannel, cameras);
            }        
            break;
          case 'delete':
            if(request.params.id) {
              const id = request.params.id as string;
              audios = this.store.get('AudioHardware');
              audios = audios.filter(function(item) {
                return item.uuid !== id;
              });
              this.store.set('AudioHardware', audios);
              // event.sender.send(request.responseChannel, cameras);
            }            
            break;
          case 'edit':
            if(request.params.audio) {
              let audio = request.params.audio as AudioHardware;
              audios = this.store.get('AudioHardware');
              const audioIndex = audios.findIndex((obj => obj.uuid === audio.uuid));
              // update sponsor
              audios[audioIndex].title = audio.title;
              audios[audioIndex].deviceid = audio.deviceid;
              audios[audioIndex].type = audio.type;
              this.store.set('AudioHardware', audios);
              // event.sender.send(request.responseChannel, cameras);
            }  
            break;
          case 'get':
          default:
            audios = this.store.get('AudioHardware');
        }
      }
      return audios;
    } catch (error) {
      this.log.error(error);
      throw error;
      // event.sender.send(request.responseChannel, []);
    }
  }
}