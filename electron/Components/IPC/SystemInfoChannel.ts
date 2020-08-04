import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent } from 'electron';
import { IpcRequest } from "../../../shared/IpcRequest";
import { exec } from "child_process";

export class SystemInfoChannel implements IpcChannelInterface {
  getName(): string {
    return 'system-info';
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    try {
      if (!request.responseChannel) {
        request.responseChannel = `${this.getName()}_response`;
      }
      var kernel = await this.execPromise('systeminfo');
      event.sender.send(request.responseChannel, { kernel });
    } catch (error) {

    }
  }

  private execPromise(command: string): Promise<string> {
    return new Promise(function(resolve, reject) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
}
}