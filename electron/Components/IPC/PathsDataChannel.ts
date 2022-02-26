import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainInvokeEvent } from 'electron';
import { IpcRequest, PathsType } from "../../../src/Models";

export class PathsDataChannel implements IpcChannelInterface {

  paths: PathsType;

  constructor(paths: PathsType) {
    this.paths = paths;
  }

  getName(): string {
    return 'paths-data';
  }

  async handle(event: IpcMainInvokeEvent, request: IpcRequest): Promise<PathsType> {
    try {
      return this.paths;
    } catch (error) {
      throw error;
    }
  }
}