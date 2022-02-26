// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ipcRenderer, contextBridge } from 'electron';
import { CameraHardware, FileUp, GameStatut, LiveSettings, PathsType, Player, Sponsor, StoreType } from '../src/Models';
import { dialog } from '@electron/remote'
import { LocalFileData, constructFileFromLocalFileData } from 'get-file-object-from-local-path';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { functions, LogFunctions } from 'electron-log';
// // import * as Store from 'electron-store';

// declare global {
//   namespace NodeJS {
//       interface  Global {
//         ipcRenderer: IpcRenderer;
//         // log: LogFunctions;
//         // store: Store;
//       }
//   }
// }

// process.once('loaded', () => {
//   global.ipcRenderer = ipcRenderer
//   window.ipcRenderer = ipcRenderer
//   // global.log = functions
//   // global.store = new Store()
// });

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
// let api: Record<string, any> = {
//   //send: (channel, data) => {
//   request: (channel: string, data: any) => {
//       // whitelist channels
//       // let validChannels = ["toMain"];
//       // if (validChannels.includes(channel)) {
//           ipcRenderer.send(channel, data);
//       // }
//   },
//   //receive: (channel, func) => {
//   response: (channel: string, fn: any) => {
//       // let validChannels = ["fromMain"];
//       // if (validChannels.includes(channel)) {
//           // Deliberately strip event as it includes `sender`
//           ipcRenderer.once(channel, (event, ...args) => fn(...args));
//       // }
//   }
// };

// contextBridge.exposeInMainWorld("api", api);


function getFileFromPath(path: string): FileUp | null {
  try {
    let datas: FileUp | null = null;
    const filepath = path;
    const fileData = new LocalFileData(filepath);
    const fileBrowser = constructFileFromLocalFileData(fileData);
    datas = {
      file: fileBrowser,
      pathElectron: filepath,
    };
    return datas;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

ipcRenderer.on('scoreboard-update', (_event, data) => {
  window.dispatchEvent(new CustomEvent('scoreboardUpdateReact', { detail: data }));
});

contextBridge.exposeInMainWorld('app', {
  
  GetStoredConfig: async (): Promise<StoreType> => {
    try {
      return await ipcRenderer.invoke('stored-config');
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  manageObsSettings: async (params: { setter: boolean, bitrate?: number }): Promise<number> => {
    try {
      return await ipcRenderer.invoke('obs-settings', { params });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  getPaths: async (): Promise<PathsType> => {
    try {
      return await ipcRenderer.invoke('paths-data');
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  manageSponsors: async (params: { action: string, sponsor?: Sponsor, id?: string }): Promise<Sponsor[]> => {
    try {
      return await ipcRenderer.invoke('sponsors-data', { params });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  managePlayers: async (params: { action: string, sponsor?: Sponsor, id?: string }): Promise<Player[]> => {
    try {
      return await ipcRenderer.invoke('players-data', { params });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  setFile: async (params: { file: string, isHomeTeam?: boolean, isBg?: boolean }): Promise<string> => {
    try {
      return await ipcRenderer.invoke('file-upload', { params });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  manageCamera: async (params: { action: string, camera?: CameraHardware, id?: string }): Promise<CameraHardware> => {
    try {
      return await ipcRenderer.invoke('camera-data', { params });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  sendToScoreboard: (params: { body: { GameStatut: GameStatut, LiveSettings: LiveSettings }}): void => {
    try {
      ipcRenderer.invoke('scoreboard-info', { responseChannel: 'scoreboard-update', params });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getFileFromPath: (path: string): FileUp | null => {
    try {
      return getFileFromPath(path);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  selectElectronFile: async (image: boolean): Promise<FileUp | null> => {
    try {
      const filters = image ? { name : 'Images', extensions: ['jpg', 'png'] } : { name: 'Films', extensions: ['mkv', 'avi', 'mp4'] };
      let datas: FileUp | null = null;
      const file = await dialog.showOpenDialog(require('@electron/remote').getCurrentWindow(), {
        title: 'Select the File to be uploaded',
        buttonLabel: 'Upload',
        properties: ['openFile'],
        filters: [filters],
      });
      if (!file.canceled) {
        datas = getFileFromPath(file.filePaths[0]);
      }  
      return datas;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

});