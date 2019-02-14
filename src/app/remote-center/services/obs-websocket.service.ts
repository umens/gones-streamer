import { Injectable } from '@angular/core';
import { WebsocketService } from '../../shared/services/websocket.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObsWebsocketService {

  connected = false;
  private eventSource = new Subject<string>();
  eventSource$ = this.eventSource.asObservable();
  // private eventSource = new BehaviorSubject(null);
  // currentEvent = this.eventSource.asObservable();

  constructor(private _wsService: WebsocketService) {
    this._wsService.on('event', message => {
      this.eventSource.next(message);
      // this.onEvent(message);
    });
  }

  connect(host, port, password, secure) {
    return new Promise((resolve, reject) => {
      this._wsService.connect(host, port, secure).then((data: any) => {
        if (data.authRequired) {
          return this._wsService.login(password);
        }
        return data;
      }).then(data => {
        if (data || !data.authRequired) {
          // tslint:disable-next-line:no-console
          console.debug('connected');
          this.connected = true;
          resolve();
        }
      }).catch(err => {
        console.error(err.message);
        this.connected = false;
        reject(err);
      });
    });
  }

  disconnect(): void {
    this._wsService.close();
  }

  emit(OBSEvent, args: any = {}) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      args['request-type'] = OBSEvent;
      _this._wsService.send(args).then(data => {
        resolve(data);
      }).catch(err => {
        console.error(err.message);
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
    args['item'] = name;
    return this.emit('SetSceneItemProperties', args);
  }

  SetTextGDIPlusProperties(name: string, args: { text: string; }): any {
    args['source'] = name;
    return this.emit('SetTextGDIPlusProperties', args);
  }

  GetTextGDIPlusProperties(name: string): any {
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

}
