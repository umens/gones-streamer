// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ipcRenderer, IpcRenderer, contextBridge } from 'electron';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { functions, LogFunctions } from 'electron-log';
import * as Store from 'electron-store';

declare global {
  namespace NodeJS {
      interface  Global {
        ipcRenderer: IpcRenderer;
        log: LogFunctions;
        store: Store;
      }
  }
}

process.once('loaded', () => {
  global.ipcRenderer = ipcRenderer
  global.log = functions
  global.store = new Store()
});

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