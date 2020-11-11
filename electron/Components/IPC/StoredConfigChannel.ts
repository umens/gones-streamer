import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent } from 'electron';
import { IpcRequest, StoreType, GetDefaultConfig } from "../../../src/Models";
import Store from 'electron-store';
import ElectronLog from "electron-log";

export class StoredConfigChannel implements IpcChannelInterface {

  private store: Store<StoreType> = new Store<StoreType>();
  log: ElectronLog.LogFunctions;

  constructor() {
    this.log = ElectronLog.scope('StoredConfigChannel');
  }

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
      const Sponsors = await this.store.get("Sponsors", defaultConfig.Sponsors);
      const Players = await this.store.get("Players", defaultConfig.Players);
      let storedConfig: StoreType = {
        GameStatut,
        LiveSettings,
        BackgroundImage,
        CamerasHardware,
        Sponsors,
        Players,
      };
      event.sender.send(request.responseChannel, { storedConfig });
    } catch (error) {
      this.log.error(error);
    }
  }
}