import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { ObsWebsocketService } from '../../shared/services';
import { ElectronService } from '../../core/services';

@Component({
  selector: 'app-live-settings',
  templateUrl: './live-settings.component.html',
  styleUrls: ['./live-settings.component.scss']
})
export class LiveSettingsComponent implements OnInit {

  subscription: Subscription;
  bgFilePath: string;
  // private bitrate: number;
  // private streamKey: string;
  // private streamService: string;
  // controls: FormArray;
  liveSettingsForm = new FormGroup({
    bitrate: new FormControl(''),
    streamKey: new FormControl(''),
    streamService: new FormControl(''),
  });
  replaySettingsForm = new FormGroup({
    buffer: new FormControl(''),
  });
  loadingBgImage = true;
  loadingStreamService = true;
  loadingStreamSettings = true;
  sendingLiveSettingsDatas = false;

  loadingReplaySettings = true;
  sendingReplaySettingsDatas = false;

  files: File[] = [];

  constructor(
    private obsWebsocket: ObsWebsocketService,
    private toastrService: NbToastrService,
    private electronService: ElectronService
  ) {
    // this.getDataFiles().then((data: any) => {
    //   // this.homeTeam = new Team(data.gameSettings.homeTeam);
    //   // this.awayTeam = new Team(data.gameSettings.awayTeam);
    //   // this.gameOptions = new GameOptions(data.gameSettings.options);
    // });
    this.obsWebsocket.connect('localhost', 4444, '', false).then(async () => {
      this.toastrService.success(`Successfully connected to OBS`, `Connected`);
      this.obsWebsocket.GetSourceSettings('Background').then((data: any) => {
        this.bgFilePath = data.sourceSettings.file;
        this.loadingBgImage = false;
      });
      this.obsWebsocket.GetSourceSettings('Replay Video').then((data: any) => {
        this.replaySettingsForm.get('buffer').setValue(data.sourceSettings.duration);
        this.loadingReplaySettings = false;
      });
      this.obsWebsocket.GetStreamSettings().then((data: any) => {
        this.liveSettingsForm.get('streamKey').setValue(data.settings.key);
        this.liveSettingsForm.get('streamService').setValue(data.settings.service);
        this.loadingStreamService = false;
      });
      this.getOBSStreamSettings().then((data: any) => {
        this.liveSettingsForm.get('bitrate').setValue(data.bitrate);
        this.loadingStreamSettings = false;
      });
    }).catch(err => {
      this.toastrService.danger(`${err.message}`, `Error`);
      console.error(err);
    });
  }

  ngOnInit() {
  }

  onLiveSubmit() {
    this.sendingLiveSettingsDatas = true;
    this.obsWebsocket.SetStreamSettings('rtmp_common', { key: this.liveSettingsForm.value.streamKey }, true)
    .then((data: any) => {
      return this.updateStreamSettings(this.liveSettingsForm.value.bitrate);
    }).then(() => {
      this.toastrService.success(`Live settings successfully updated`, `Saved`);
      this.sendingLiveSettingsDatas = false;
    });
  }

  async getOBSStreamSettings() {
    return new Promise<any>((resolve, reject) => {
      if (this.electronService.isElectron) {
        this.electronService.ipcRenderer.once('getStreamSettingsOBSResponse', (event, arg) => {
          resolve(arg);
        });
        this.electronService.ipcRenderer.send('getStreamSettingsOBS');
      } else {
        resolve(null);
      }
    });
  }

  updateStreamSettings(bitrate: number) {
    // tslint:disable-next-line: no-unused-expression
    return new Promise<any>((resolve, reject) => {
      if (this.electronService.isElectron) {
        this.electronService.ipcRenderer.once('setStreamSettingsOBSResponse', (event, arg) => {
          resolve(arg);
        });
        this.electronService.ipcRenderer.send('setStreamSettingsOBS', bitrate);
      } else {
        resolve(null);
      }
    });
  }

  onReplaySubmit() {
    this.sendingReplaySettingsDatas = true;
    this.obsWebsocket.SetSourceSettings('Replay Video', { duration: this.replaySettingsForm.value.buffer })
    .then((data: any) => {
      return this.obsWebsocket.SetSourceSettings('cam 1', { duration: this.replaySettingsForm.value.buffer });
    }).then((data: any) => {
      this.sendingReplaySettingsDatas = false;
    });
  }

  uploadFile(fileList: FileList) {
    const file: File = fileList.item(0);
    const that = this;
    // tslint:disable-next-line: no-unused-expression
    new Promise<any>((resolve, reject) => {
      if (this.electronService.isElectron) {
        this.electronService.ipcRenderer.once('uploadBGImageResponse', (event, arg: string) => {
          that.bgFilePath = arg + '#' + new Date().getTime();
          this.obsWebsocket.SetSourceSettings('Background', { file: arg }).then((data: any) => {
            // this.bgFilePath = data.sourceSettings.file;
            resolve(arg);
          });
        });
        this.electronService.ipcRenderer.send('uploadBGImage', {
          path: file.path,
          name: file.name,
        });
      } else {
        resolve(null);
      }
    });
  }

}
