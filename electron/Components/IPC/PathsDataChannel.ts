import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent } from 'electron';
import { IpcRequest, PathsType, Sponsor } from "../../../src/Models";
import { join } from 'path';
import { promises as fs } from 'fs';

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