import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { WebsocketService } from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ObsWebsocketService {

  connected = false;
  private eventSource = new Subject<string>();
  eventSource$ = this.eventSource.asObservable();
  // private eventSource = new BehaviorSubject(null);
  // currentEvent = this.eventSource.asObservable();

  constructor(private wsService: WebsocketService) {
    this.wsService.on('event', message => {
      this.eventSource.next(message);
      // this.onEvent(message);
    });
  }

  connect(host: string, port: number, password: string, secure: boolean) {
    return new Promise((resolve, reject) => {
      this.wsService.connect(host, port, secure).then((data: any) => {
        if (data.authRequired) {
          return this.wsService.login(password);
        }
        return data;
      }).then(data => {
        if (data || !data.authRequired) {
          // console.debug('connected');
          this.connected = true;
          resolve();
        }
      }).catch(err => {
        // console.log(err.message);
        this.connected = false;
        reject(err);
      });
    });
  }

  disconnect(): void {
    this.wsService.close();
  }

  emit(OBSEvent, args: any = {}) {
    const that = this;
    return new Promise((resolve, reject) => {
      args['request-type'] = OBSEvent;
      that.wsService.send(args).then(data => {
        resolve(data);
      }).catch(err => {
        console.log(err.message);
        reject(err.message);
      });
    });
  }

  // onEvent(message: any) {
  //   this.eventSource.next(message);
  // }

  getScenesList() {
    if (this.connected) {
      return this.emit('GetSceneList');
    }
  }

  getProfilesList() {
    if (this.connected) {
      return this.emit('ListProfiles');
    }
  }

  GetCurrentProfile() {
    if (this.connected) {
      return this.emit('GetCurrentProfile');
    }
  }

  SetCurrentProfile(name: string) {
    if (this.connected) {
      return this.emit('SetCurrentProfile', { 'profile-name': name });
    }
  }

  getCurrentScene() {
    if (this.connected) {
      return this.emit('GetCurrentScene');
    }
  }

  setCurrentScene(name: string): any {
    return this.emit('SetCurrentScene', { 'scene-name': name });
  }

  SetSceneItemProperties(name: string, args: any = {}): any {
    // tslint:disable-next-line: no-string-literal
    args['item'] = name;
    return this.emit('SetSceneItemProperties', args);
  }

  SetTextGDIPlusProperties(name: string, args: { text: string; }): any {
    // tslint:disable-next-line: no-string-literal
    args['source'] = name;
    return this.emit('SetTextGDIPlusProperties', args);
  }

  GetTextGDIPlusProperties(name: string): any {
    // tslint:disable-next-line: object-literal-key-quotes
    return this.emit('GetTextGDIPlusProperties', { 'source': name });
  }

  StartStreaming(): any {
    return this.emit('StartStreaming', {});
  }

  StopStreaming(): any {
    return this.emit('StopStreaming', {});
  }

  StartStopStreaming(): any {
    return this.emit('StartStopStreaming', {});
  }

  GetStreamingStatus(): any {
    return this.emit('GetStreamingStatus', {});
  }

  StartReplayBuffer(): any {
    return this.emit('StartReplayBuffer', {});
  }

  StopReplayBuffer(): any {
    return this.emit('StopReplayBuffer', {});
  }

  StartStopReplayBuffer(): any {
    return this.emit('StartStopReplayBuffer', {});
  }

  SaveReplayBuffer(): any {
    return this.emit('SaveReplayBuffer', {});
  }

  EnableStudioMode(): any {
    return this.emit('EnableStudioMode', {});
  }

  DisableStudioMode(): any {
    return this.emit('DisableStudioMode', {});
  }

  ToggleStudioMode(): any {
    return this.emit('ToggleStudioMode', {});
  }

  GetSourceSettings(sourceName: string) {
    if (this.connected) {
      return this.emit('GetSourceSettings', { sourceName });
    }
  }

  SetSourceSettings(sourceName: string, sourceSettings: any) {
    if (this.connected) {
      return this.emit('SetSourceSettings', { sourceName, sourceSettings });
    }
  }

  GetStreamSettings() {
    if (this.connected) {
      return this.emit('GetStreamSettings', {});
    }
  }

  SetStreamSettings(type: string, settings: any, save: boolean) {
    if (this.connected) {
      return this.emit('SetStreamSettings', { type, settings, save });
    }
  }
}
