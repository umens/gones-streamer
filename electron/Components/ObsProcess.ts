import ElectronLog from 'electron-log';
import { execFile, ChildProcess } from 'child_process';
import path from 'path';

export default class ObsProcess {

  log: ElectronLog.LogFunctions;
  binFolder: string;
  obsProcess: ChildProcess | undefined;

  constructor(obj: { binFolder: string }) {
    this.log = ElectronLog.scope('OBS');
    this.binFolder = obj.binFolder;
  }

  startObs = async (): Promise<void> => {
    try {
      const executablePath = path.join(this.binFolder, '/obs/bin/64bit/obs64.exe');
      const parameters = [
        '--portable',
        '--minimize-to-tray',
        '--collection "gones-streamer"',
        '--profile "gones-streamer"',
        '--scene "Starting"'
      ];  
      this.log.info('Starting...');
      this.obsProcess = await execFile(executablePath, parameters, { cwd: path.join(this.binFolder, '/obs/bin/64bit') });
      this.obsProcess.stdout!.on('data', this.onStdOut);
      this.obsProcess.on('close', this.onClosed);
      this.log.info('Process started.');
    } catch (error) {
      this.log.error(error);
    }
  }

  private onStdOut = (chunk: any) => {
    this.log.info(chunk);
  }

  private onClosed = (code: number, signal: NodeJS.Signals) => {
    this.log.info(code);
    this.log.info(signal);

    // do smthg to restart obs.
  }

  stopObs = async () => {
    try {
      this.log.info('Closing...');
      const closed = this.obsProcess!.kill();
      if(closed) {
        this.log.info('Closed.');
      } else {
        throw new Error('Erreur lors de la fermeture de OBS');
      }
    } catch (error) {
      throw error;
    }
  }
}