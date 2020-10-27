import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent } from 'electron';
import { IpcRequest, PathsType, Player, Sponsor } from "../../../src/Models";
import { join } from 'path';
import { promises as fs } from 'fs';

export class PlayersDataChannel implements IpcChannelInterface {

  paths: PathsType;

  constructor(paths: PathsType) {
    this.paths = paths;
  }

  getName(): string {
    return 'players-data';
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
    try {
      if (!request.responseChannel) {
        request.responseChannel = `${this.getName()}_response`;
      }
      
      if(request.params && request.params.getter) {
        const rawPlayers = await fs.readFile(join(this.paths.playersFolder, '/players.json'), 'utf8');
        const players: Player[] = JSON.parse(rawPlayers);
        event.sender.send(request.responseChannel, players);
      } else {
        if(request.params && request.params.player) {
          const rawPlayers = await fs.readFile(join(this.paths.playersFolder, '/players.json'), 'utf8');
          const players: Player[] = JSON.parse(rawPlayers);
          players.push(request.params.player);
          await fs.writeFile(
            join(this.paths.playersFolder, '/players.json'),
            JSON.stringify(players, null, 2),
          );
        }
        event.sender.send(request.responseChannel, true);
      }
    } catch (error) {

    }
  }
}