import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent } from 'electron';
import { IpcRequest } from "../../../shared/IpcRequest";
import { StoreType, Quarter, TeamPossession } from "../../../shared";
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
      const GameStatus = await this.store.get("GameStatus", {
        AwayTeam: {
          city: 'Ville Equipe Exterieur',
          color: '#612323',
          logo: 'https://placekitten.com/450/450',
          name: 'Nom Equipe Exterieur',
          score: 0,
          timeout: 3
        },
        HomeTeam: {
          city: 'Ville Equipe Domicile',
          color: '#133155',
          logo: 'https://placekitten.com/450/450',
          name: 'Nom Equipe Domicile',
          score: 0,
          timeout: 3
        },
        Options: {
          quarter: Quarter.ONE,
          possession: TeamPossession.HOME,
          flag: false,
          showScoreboard: false,
        }
      });
      const LiveSettings = await this.store.get("LiveSettings", {
        bitrate: 6000,
        buffer: 15,
        streamKey: null
      });
      const BackgroundImage = await this.store.get("BackgroundImage", '');
      let storedConfig: StoreType = {
        GameStatus,
        LiveSettings,
        BackgroundImage
      };
      event.sender.send(request.responseChannel, { storedConfig });
    } catch (error) {

    }
  }
}