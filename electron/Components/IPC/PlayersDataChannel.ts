import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainInvokeEvent } from 'electron';
import { IpcRequest, PathsType, Player } from "../../../src/Models";
import { join } from 'path';
import { promises as fs } from 'fs';
import ElectronLog from "electron-log";

export class PlayersDataChannel implements IpcChannelInterface {

  log: ElectronLog.LogFunctions;
  paths: PathsType;

  constructor(paths: PathsType) {
    this.log = ElectronLog.scope('PlayersDataChannel');
    this.paths = paths;
  }

  getName(): string {
    return 'players-data';
  }

  async handle(event: IpcMainInvokeEvent, request: IpcRequest): Promise<Player[]> {
    // if (!request.responseChannel) {
    //   request.responseChannel = `${this.getName()}_response`;
    // }
    try {
      let players: Player[] = [];
      if(request.params && request.params.action) {
        switch (request.params.action) {
          case 'add':
            if(request.params.player) {
              const rawPlayers = await fs.readFile(join(this.paths.playersFolder, '/players.json'), 'utf8');
              players = JSON.parse(rawPlayers);
              players.push(request.params.player);
              await fs.writeFile(
                join(this.paths.playersFolder, '/players.json'),
                JSON.stringify(players, null, 2),
              );
            }
            // event.sender.send(request.responseChannel, true);          
            break;
          case 'delete':
            if(request.params.id) {
              
              // event.sender.send(request.responseChannel, true);
            }            
            break;
          case 'edit':
            if(request.params.sponsor) {
              
              // event.sender.send(request.responseChannel, true);
            }  
            break;
          case 'get':
          default:
            const rawPlayers = await fs.readFile(join(this.paths.playersFolder, '/players.json'), 'utf8');
            players = JSON.parse(rawPlayers);
            // event.sender.send(request.responseChannel, players);
            break;
        }
      }
      return players;
    } catch (error) {
      this.log.error(error);
      throw error;
      // event.sender.send(request.responseChannel, []);
    }
  }
}