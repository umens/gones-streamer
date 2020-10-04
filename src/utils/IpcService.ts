import { IpcRenderer } from 'electron';
import { IpcRequest } from '../Models';

export class IpcService {

  private ipcRenderer!: IpcRenderer;

  public send<T>(channel: string, request: IpcRequest = {}): Promise<T> {
    // If the ipcRenderer is not available try to initialize it
    if (!this.ipcRenderer) {
      this.initializeIpcRenderer();
    }
    // If there's no responseChannel let's auto-generate it
    if (!request.responseChannel) {
      request.responseChannel = `${channel}_response_${new Date().getTime()}`
    }

    const ipcRenderer = this.ipcRenderer;
    ipcRenderer.send(channel, request);

    // This method returns a promise which will be resolved when the response has arrived.
    return new Promise(resolve => {
      ipcRenderer.once(request.responseChannel!, (event, response) => resolve(response));
    });
  }
  
  public sendWithoutResponse<T>(channel: string, request: IpcRequest = {}): void {
    // If the ipcRenderer is not available try to initialize it
    if (!this.ipcRenderer) {
      this.initializeIpcRenderer();
    }
    // If there's no responseChannel let's auto-generate it
    if (!request.responseChannel) {
      request.responseChannel = `${channel}_response_${new Date().getTime()}`
    }

    const ipcRenderer = this.ipcRenderer;
    ipcRenderer.send(channel, request);
  }
  
  public receiveUpdate<T>(channel: string, request: IpcRequest = {}): IpcRenderer {
    // If the ipcRenderer is not available try to initialize it
    if (!this.ipcRenderer) {
      this.initializeIpcRenderer();
    }
    // If there's no responseChannel let's auto-generate it
    if (!request.responseChannel) {
      request.responseChannel = `${channel}_response_${new Date().getTime()}`
    }

    const ipcRenderer = this.ipcRenderer;
    return ipcRenderer;
    
    // return new Promise(resolve => {
    //   ipcRenderer.on(request.responseChannel!, (event, response) => resolve(response));
    // });
  }

  private initializeIpcRenderer() {
    // console.debug(window)
    // if (!window || !window.process || !window.require) {
    if (!window || !window.ipcRenderer) {
      throw new Error(`Unable to require renderer process`);
    }
    this.ipcRenderer = window.ipcRenderer;
  }
}