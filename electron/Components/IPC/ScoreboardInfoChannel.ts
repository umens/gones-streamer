import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainInvokeEvent, WebContents } from 'electron';
import { IpcRequest,  } from "../../../src/Models";

export class ScoreboardInfoChannel implements IpcChannelInterface {
  getName(): string {
    return 'scoreboard-info';
  }

  async handle(event: IpcMainInvokeEvent, request: IpcRequest, to: WebContents): Promise<void> {
    try {
      if (!request.responseChannel) {
        request.responseChannel = `${this.getName()}_response`;
      }
      to.send(request.responseChannel, request.params?.body || {});
    } catch (error) {
    }
  }
}