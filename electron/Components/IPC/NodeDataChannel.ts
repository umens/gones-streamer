import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainInvokeEvent } from 'electron';
import { IpcRequest } from "../../../src/Models";
import ElectronLog from "electron-log";
import { getFonts } from 'font-list';

export class NodeDataChannel implements IpcChannelInterface {

  log: ElectronLog.LogFunctions;

  constructor() {
    this.log = ElectronLog.scope('NodeDataChannel');
  }

  getName(): string {
    return 'node-data';
  }

  async handle(event: IpcMainInvokeEvent, request: IpcRequest): Promise<any> {
    try {
      if(request.params && request.params.action) {        
        switch (request.params.action) {
          case 'get-font':
            return await getFonts();
          default:
            
        }
      }
    } catch (error) {
      this.log.error(error);
      throw error;
      // event.sender.send(request.responseChannel, []);
    }
  }
}