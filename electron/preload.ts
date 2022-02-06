
import { GameStatut, LiveSettings, StoreType, SceneName, Sponsor } from '../src/Models';
import { ipcRenderer, contextBridge, IpcRenderer } from 'electron';

import { IpcService } from '../src/Utils';
import { NodeObs as osn } from 'obs-studio-node';

const { getCurrentWindow } = require('@electron/remote');

let ipc: IpcService;
let ro: ResizeObserver;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
      interface  Global {
        ipcRenderer: IpcRenderer;
        // log: LogFunctions;
        // store: Store;
      }
  }
}

// declare global {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace window {
//     interface  Global {
//       ipcRenderer: IpcRenderer;
//     }
//   }
// }
  
// CPU: 0.3
// averageTimeToRenderFrame: 0.774735
// diskSpaceAvailable: "206.313 GB"
// frameRate: 30.000000300000007
// memoryUsage: 330.0859375
// numberDroppedFrames: 0
// percentageDroppedFrames: 0
// recordingBandwidth: 0
// recordingDataOutput: 0
// streamingBandwidth: 0
// streamingDataOutput: 
process.once('loaded', () => {
  global.ipcRenderer = ipcRenderer;

  ipc = new IpcService();

  ipcRenderer.on('performanceStatistics', (_event, data) => {
    window.dispatchEvent(new CustomEvent('performanceStatisticsReact', { detail: data }));
  });
  
  ipcRenderer.on('scoreboard-update', (_event, data) => {
    window.dispatchEvent(new CustomEvent('scoreboardUpdateReact', { detail: data }));
  });
});


/**
 * The "Main World" is the JavaScript context that your main renderer code runs in.
 * By default, the page you load in your renderer executes code in this world.
 *
 * @see https://www.electronjs.org/docs/api/context-bridge
 */

/**
 * After analyzing the `exposeInMainWorld` calls,
 * `packages/preload/exposedInMainWorld.d.ts` file will be generated.
 * It contains all interfaces.
 * `packages/preload/exposedInMainWorld.d.ts` file is required for TS is `renderer`
 *
 * @see https://github.com/cawa-93/dts-for-context-bridge
 */

/**
 * Expose Environment versions.
 * @example
 * console.log( window.versions )
 */
// contextBridge.exposeInMainWorld('versions', process.versions);

// /**
//  * Safe expose node.js API
//  * @example
//  * window.nodeCrypto('data')
//  */
// contextBridge.exposeInMainWorld('nodeCrypto', {
//   sha256sum(data: BinaryLike) {
//     const hash = createHash('sha256');
//     hash.update(data);
//     return hash.digest('hex');
//   },
// });
contextBridge.exposeInMainWorld('app', {
  getConfig: async (): Promise<StoreType> => {
    try {
      const configStore: StoreType = await ipc.send<StoreType>('stored-config', { params: { getter: true }});
      return configStore;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  saveToStore: async (params: { store: StoreType }): Promise<void> => {
    try {
      await ipc.sendWithoutResponse('stored-config', { params: { setter: true, store: params.store }});
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  sendToScoreboard: async (params: { body: { GameStatut: GameStatut, LiveSettings: LiveSettings }}): Promise<void> => {
    try {
      await ipc.sendWithoutResponse('scoreboard-info', { responseChannel: 'scoreboard-update', params });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  uploadFile: async (params: { file: string, isBg?: boolean, isHomeTeam?: boolean }): Promise<string> => {
    try {
      return await await ipc.send<string>('file-upload', { params });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  

  uploadSponsor: async (params: { action: string, sponsor?: Sponsor, id?: string }): Promise<Sponsor[]> => {
    try {
      return await ipc.send<Sponsor[]>('sponsors-data', { params });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, 
});

contextBridge.exposeInMainWorld('obs', {

  setupPreview: async ({ width, height, x, y }: { width: number, height: number, x: number, y: number }): Promise<any> => {
    try {
      return await ipc.send<any>('obs', { params: { getter: true, type: 'preview-init', bounds: { width, height, x, y }}});
    } catch (error) {
      console.error(`setupPreview : ${error}`);
      throw error;
    }
  },

  resizePreview: async ({ width, height, x, y }: { width: number, height: number, x: number, y: number }): Promise<any> => {
    try {
      return await ipc.send<any>('obs', { params: { getter: true, type: 'preview-bounds', bounds: { width, height, x, y }}});
    } catch (error) {
      console.error(`resizePreview : ${error}`);
      throw error;
    }
  },

  removePreview: async (): Promise<void> => {
    try {
      ro.disconnect();
      const currentWindow = getCurrentWindow();
      currentWindow.removeAllListeners('resize', resizePreview2);
      document.removeEventListener('scroll', resizePreview2);

      console.error(`removePreview`);
      // osn.OBS_content_destroyDisplay('previewDisplay');
      await ipc.send<boolean>('obs', { params: { getter: true, type: 'preview-remove' }});
      // OBSRecorder.removePreview();
      // osn.OBS_content_destroyDisplay('previewDisplay');
    } catch (error) {
      console.error(`removePreview : ${error}`);
      throw error;
    }
  },
  
  listenResize: () => {
    try {
      const currentWindow = getCurrentWindow();
      currentWindow.on('resize', resizePreview2);
      currentWindow.on('close', () => {
        currentWindow.removeAllListeners('resize', resizePreview2);
      });
      document.addEventListener('scroll', resizePreview2);
      ro = new ResizeObserver(resizePreview2);
      const elem = document.querySelector('#previewObs');
      if(elem != null) {
        ro.observe(elem);
      }
    } catch (error) {
      console.error(`listenResize : ${error}`);
    }
  }, 

  startStats: async (): Promise<boolean> => {
    try {
      return await ipc.send<boolean>('obs', { params: { getter: true, type: 'start-stats' }});
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  stopStats: async (): Promise<boolean> => {
    try {
      return await ipc.send<boolean>('obs', { params: { getter: true, type: 'stop-stats' }});
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // update 
  setActiveScene: async (scene: SceneName): Promise<void> => {
    try {
      await ipc.sendWithoutResponse('obs', { params: { setter: true, type: 'change-scene', scene }});
    } catch (error) {
      console.error(error);
    }
  },

  changeSourceVisibility: async (data: { source: string, visible: boolean, scene: SceneName}): Promise<void> => {
    try {
      await ipc.sendWithoutResponse('obs', { params: { setter: true, type: 'change-visibility', data }});
    } catch (error) {
      console.error(error);
    }
  },

  changeSourceText: async (data: { source: string, text: string, scene: SceneName}): Promise<void> => {
    try {
      await ipc.sendWithoutResponse('obs', { params: { setter: true, type: 'change-text', data }});
    } catch (error) {
      console.error(error);
    }
  },

});

async function resizePreview2() {
  const previewContainer = document.getElementById('previewObs');
  if(previewContainer != null) {
    const { width, height, x, y } = previewContainer.getBoundingClientRect();
    const result = await ipc.send<any>('obs', { params: { getter: true, type: 'preview-bounds', bounds: { width, height, x, y: y+24 }}});
    previewContainer.setAttribute('style', `height: ${result.height}px`);
  }
}