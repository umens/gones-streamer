import { IpcMainInvokeEvent, WebContents } from 'electron';
import { IpcRequest } from "../../../src/Models";

export interface IpcChannelInterface {
  getName(): string;

  handle(event: IpcMainInvokeEvent, request: IpcRequest, to?: WebContents): Promise<any>;
}

