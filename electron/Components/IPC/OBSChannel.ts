import { BrowserWindow, IpcMainEvent } from 'electron';
import { scope, LogFunctions } from 'electron-log';

import { IpcRequest } from "../../../src/Models";
import { IpcChannelInterface } from './IpcChannelInterface';
import OBSRecorder from '../OBSRecorder';

export class OBSChannel implements IpcChannelInterface {

  log: LogFunctions;
  obs: typeof OBSRecorder;
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.obs = OBSRecorder;
    this.mainWindow = mainWindow;
    this.log = scope('OBSChannel');
  }

  getName(): string {
    return 'obs';
  }

  async handle(event: IpcMainEvent, request: IpcRequest): Promise<any> {
    try {
      if (!request.responseChannel) {
        request.responseChannel = `${this.getName()}_response`;
      }
      
      if(request.params && 'setter' in request.params) {
        switch (request.params?.type) {
          case 'change-scene':
            OBSRecorder.changeActiveScene(request.params.scene);
            break;
          case 'change-visibility':
            OBSRecorder.changeSourceVisibility(request.params.data);
            break;
          case 'change-text':
            OBSRecorder.changeSourceText(request.params.data);
            break;
            
          default:
            break;
        }
        // const rawStreamSettingsOBS = await fs.readFile(join(this.paths.binFolder, '/obs/config/obs-studio/basic/profiles/gonesstreamer/streamEncoder.json'), 'utf8');
        // const streamSettingsOBS = JSON.parse(rawStreamSettingsOBS);
        // streamSettingsOBS.bitrate = request.params['bitrate'];
        // await fs.writeFile(
        //   join(this.paths.binFolder, '/obs/config/obs-studio/basic/profiles/gonesstreamer/streamEncoder.json'),
        //   JSON.stringify(streamSettingsOBS, null, 2),
        // );
        // event.sender.send(request.responseChannel, true);
      } else if(request.params && 'getter' in request.params) {        
        switch (request.params?.type) {
          case 'preview-init':
            event.sender.send(request.responseChannel, OBSRecorder.setupPreview(this.mainWindow, request.params.bounds));
            break;
          case 'preview-bounds':
            event.sender.send(request.responseChannel, OBSRecorder.resizePreview(this.mainWindow, request.params.bounds));
            break;
          case 'preview-remove':
            console.log('remove')
            event.sender.send(request.responseChannel, OBSRecorder.removePreview());
            break;
          case 'start-stats':
            event.sender.send(request.responseChannel, OBSRecorder.startStats());
            break;
          case 'stop-stats':
            console.log('stop')
            event.sender.send(request.responseChannel, OBSRecorder.stopStats());
            break;
        
          default:
            break;
        }
      }
    } catch (error) {
      this.log.error(error);
    }
  }
}