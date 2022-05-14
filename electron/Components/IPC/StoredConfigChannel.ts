import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainInvokeEvent } from 'electron';
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

  async handle(event: IpcMainInvokeEvent, request: IpcRequest): Promise<StoreType> {
    try {
      // if (!request.responseChannel) {
      //   request.responseChannel = `${this.getName()}_response`;
      // }
      let storedConfig: StoreType = this.store.store;
      if(request.params && request.params.action) {        
        switch (request.params.action) {
          case 'set':
            switch(request.params.key) {
              case 'store':
                this.store.set(request.params.value as StoreType);
                storedConfig = this.store.store
                break;

                default:
                  this.store.set(request.params.key as string, request.params.value);
                  break;
            }
            break;

          case 'get':
          default:
            const defaultConfig = GetDefaultConfig();
            const GameStatut = await this.store.get("GameStatut", defaultConfig.GameStatut);
            const LiveSettings = await this.store.get("LiveSettings", defaultConfig.LiveSettings);
            const BackgroundImage = await this.store.get("BackgroundImage", defaultConfig.BackgroundImage);
            const CamerasHardware = await this.store.get("CamerasHardware", defaultConfig.CamerasHardware);
            const AudioHardware = await this.store.get("AudioHardware", defaultConfig.AudioHardware);
            const Sponsors = await this.store.get("Sponsors", defaultConfig.Sponsors);
            const Players = await this.store.get("Players", defaultConfig.Players);
            const UpdateChannel = await this.store.get("UpdateChannel", defaultConfig.UpdateChannel);
            const TextsSettings = await this.store.get("TextsSettings", defaultConfig.TextsSettings);
            const ScoreboardSettings = await this.store.get("ScoreboardSettings", defaultConfig.ScoreboardSettings);
            storedConfig = {
              GameStatut,
              LiveSettings,
              BackgroundImage,
              CamerasHardware,
              AudioHardware,
              Sponsors,
              Players,
              UpdateChannel,
              TextsSettings,
              ScoreboardSettings,
            };
            break;
        // event.sender.send(request.responseChannel, { storedConfig });
        }
      }
      return storedConfig;
    } catch (error) {
      this.log.error(error);
      throw error;
    }
  }
}