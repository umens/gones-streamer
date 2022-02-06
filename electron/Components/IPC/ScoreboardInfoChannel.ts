
import { BrowserWindow, IpcMainEvent, WebContents } from 'electron';

import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcRequest,  } from "../../../src/Models";

export class ScoreboardInfoChannel implements IpcChannelInterface {
  getName(): string {
    return 'scoreboard-info';
  }

  async handle(event: IpcMainEvent, request: IpcRequest, to: BrowserWindow): Promise<void> {
    try {
      if (!request.responseChannel) {
        request.responseChannel = `${this.getName()}_response`;
      }
      to.webContents.send(request.responseChannel, request.params?.body || {});
    } catch (error) {
    }
  }
}