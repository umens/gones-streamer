import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent } from 'electron';
import { IpcRequest, StoreType, GetDefaultConfig } from "../../../src/Models";
import * as Store from 'electron-store';

export class StoredConfigChannel implements IpcChannelInterface {

  private store: Store<StoreType> = new Store<StoreType>();

  getName(): string {
    return 'stored-config';
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    try {
      if (!request.responseChannel) {
        request.responseChannel = `${this.getName()}_response`;
      }
      const defaultConfig = GetDefaultConfig();
      const GameStatut = await this.store.get("GameStatut", defaultConfig.GameStatut);
      const LiveSettings = await this.store.get("LiveSettings", defaultConfig.LiveSettings);
      const BackgroundImage = await this.store.get("BackgroundImage", defaultConfig.BackgroundImage);
      const CamerasHardware = await this.store.get("CamerasHardware", defaultConfig.CamerasHardware);
      let storedConfig: StoreType = {
        GameStatut,
        LiveSettings,
        BackgroundImage,
        CamerasHardware,
      };
      event.sender.send(request.responseChannel, { storedConfig });
    } catch (error) {

    }
  }
}