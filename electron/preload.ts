// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ipcRenderer, contextBridge } from 'electron';
import { AudioHardware, AutoUpdaterData, AutoUpdaterEvent, CameraHardware, FileUp, GameStatut, LiveSettings, PathsType, Player, Quarter, Sponsor, StoreType, TextsSettings, Timeout } from '../src/Models';
import { dialog } from '@electron/remote'
import { LocalFileData, constructFileFromLocalFileData } from 'get-file-object-from-local-path';
import { ScoreboardSettings } from '../src/Models/Models';

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

// send infos to scoreboard window
ipcRenderer.on('scoreboard-update', (_event, data) => {
  window.dispatchEvent(new CustomEvent('scoreboardUpdateReact', { detail: data }));
});

// updater event
ipcRenderer.on('autoUpdate', (_event, data: {eventType: AutoUpdaterEvent, data: AutoUpdaterData}) => {
  window.dispatchEvent(new CustomEvent<{eventType: AutoUpdaterEvent, data: AutoUpdaterData}>('autoUpdaterEvent', { detail: data }));
});

contextBridge.exposeInMainWorld('app', {
  
  manageStoredConfig: async (params: { action: string, key?: string, value?: StoreType | string | number | boolean | Timeout | Quarter | TextsSettings | ScoreboardSettings }): Promise<StoreType> => {
    try {
      const store = await ipcRenderer.invoke('stored-config', { params });
      return store;
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
  
  getFonts: async (): Promise<string[]> => {
    try {
      return await ipcRenderer.invoke('node-data', { params: { action: 'get-font' } });
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

  manageCamera: async (params: { action: string, camera?: CameraHardware, id?: string }): Promise<CameraHardware[]> => {
    try {
      return await ipcRenderer.invoke('camera-data', { params });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  manageAudio: async (params: { action: string, audio?: AudioHardware, id?: string }): Promise<AudioHardware[]> => {
    try {
      return await ipcRenderer.invoke('audio-data', { params });
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

  handleUpdater: (eventType: AutoUpdaterEvent, data?: string): void => {
    try {
      ipcRenderer.invoke('autoUpdater', eventType, data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

});