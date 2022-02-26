import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainInvokeEvent } from 'electron';
import { CameraHardware, GetDefaultConfig, IpcRequest, StoreType } from "../../../src/Models";
import ElectronLog from "electron-log";
import Store from 'electron-store';

export class CamerasDataChannel implements IpcChannelInterface {

  log: ElectronLog.LogFunctions;
  store: Store<StoreType> = new Store<StoreType>({
		defaults: GetDefaultConfig()
  });

  constructor() {
    this.log = ElectronLog.scope('CamerasDataChannel');
  }

  getName(): string {
    return 'camera-data';
  }

  async handle(event: IpcMainInvokeEvent, request: IpcRequest): Promise<CameraHardware[]> {
    let cameras: CameraHardware[] = [];
    try {
      if(request.params && request.params.action) {        
        switch (request.params.action) {
          case 'add':
            if(request.params.camera) {
              let camera = request.params.camera as CameraHardware;
              cameras = this.store.get('CamerasHardware');
              cameras.push(camera);
              this.store.set('CamerasHardware', cameras);
              // event.sender.send(request.responseChannel, cameras);
            }        
            break;
          case 'delete':
            if(request.params.id) {
              const id = request.params.id as string;
              cameras = this.store.get('CamerasHardware');
              const cameraIndex = cameras.findIndex((obj => obj.deviceid === id));
              cameras.splice(cameraIndex, 1);
              this.store.set('CamerasHardware', cameras);
              // event.sender.send(request.responseChannel, cameras);
            }            
            break;
          case 'edit':
            if(request.params.camera) {
              let camera = request.params.camera as CameraHardware;
              cameras = this.store.get('CamerasHardware');
              const cameraIndex = cameras.findIndex((obj => obj.deviceid === camera.deviceid));
              // update sponsor
              cameras[cameraIndex].title = camera.title;
              cameras[cameraIndex].deviceid = camera.deviceid;
              this.store.set('CamerasHardware', cameras);
              // event.sender.send(request.responseChannel, cameras);
            }  
            break;
          case 'get':
          default:
            cameras = this.store.get('CamerasHardware');
            // event.sender.send(request.responseChannel, this.store.get('CamerasHardware'));
        }
      }
      return cameras;
    } catch (error) {
      this.log.error(error);
      throw error;
      // event.sender.send(request.responseChannel, []);
    }
  }
}