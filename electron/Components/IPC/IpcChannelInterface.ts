import { IpcMainEvent } from 'electron';
import { IpcRequest } from "../../../src/Models";

export interface IpcChannelInterface {
  getName(): string;

  handle(event: IpcMainEvent, request: IpcRequest): Promise<void>;
}

