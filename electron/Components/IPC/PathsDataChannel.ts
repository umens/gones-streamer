import { IpcMainEvent } from 'electron';

import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcRequest, PathsType } from "../../../src/Models";

export class PathsDataChannel implements IpcChannelInterface {

  paths: PathsType;

  constructor(paths: PathsType) {
    this.paths = paths;
  }

  getName(): string {
    return 'paths-data';
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    try {
      if (!request.responseChannel) {
        request.responseChannel = `${this.getName()}_response`;
      }
      
      event.sender.send(request.responseChannel, this.paths);
    } catch (error) {

    }
  }
}