import { SystemInfoChannel } from './Components/IPC';
import { functions as log } from 'electron-log';
import Main from './Components/App';
// import { Config, initSplashScreen } from '@trodi/electron-splashscreen';

// class Main {
//   private mainConfig: BrowserWindowConstructorOptions | null = null;
//   private splashConfig: BrowserWindowConstructorOptions | null = null;
//   private mainWindow: BrowserWindow | null = null;
//   private splashWindow: BrowserWindow | null = null;
//   private store: Store<StoreType> = new Store<StoreType>({
// 		defaults: {
// 			isRainbow: true,
// 		}
// 	});

//   public init(ipcChannels: IpcChannelInterface[]) {
//     log.info('%c[Main] Init', 'color: blue');
//     log.verbose('[Main] Checking first run');
//     console.log(app.getPath('userData'));
//     if(firstRun({ options: 'first-run'})) {
//       log.verbose('[Main] First run');
//       // log.info('%c[Main] Init store', 'color: blue');
//       // this.store = new Store();
//       this.store.set('isRainbow', 'false');

//     } else {
//       // log.info('%c[Main] Init store with existing value', 'color: blue');
//       // this.store = new Store();
//       this.store.set('unicorn', 'tes');
//     }
//     console.log(this.store.get("isRainbow"))
//     console.log(this.store.get("unicorn"))

//     app.on('ready', this.createWindow);
//     app.on('window-all-closed', this.onWindowAllClosed);
//     app.on('activate', this.onActivate);

//     log.info('%c[Main] Register IPc Channels', 'color: blue');
//     this.registerIpcChannels(ipcChannels);
//   }

//   private createWindow() {
//     log.verbose('[Main] Creating main Window config');
//     const size = screen.getPrimaryDisplay().workAreaSize;
//     this.mainConfig = {
//       x: 0,
//       y: 0,
//       width: size.width,
//       height: size.height,
//       title: 'Gones Streamer',
//       backgroundColor: '#17242D',
//       // icon: path.join(__dirname, `/../../dist/assets/logos/logo-raw.png`),
//       show: false,
//       webPreferences: {
//         // nodeIntegration: true
//         nodeIntegration: false, // is default value after Electron v5
//         // contextIsolation: true, // protect against prototype pollution
//         enableRemoteModule: false, // turn off remote
//         preload: path.join(__dirname, "preload.js") // use a preload script
//       }
//     };
//     log.info('%c[Main] Creating Window', 'color: blue');
//     this.mainWindow = new BrowserWindow(this.mainConfig);

//     if (isDev) {
//       this.mainWindow.loadURL('http://localhost:3000/index.html');
//     } else {
//       // 'build/index.html'
//       this.mainWindow.removeMenu();
//       this.mainWindow.loadURL(url.format({
//         pathname: path.join(__dirname, '../index.html'),
//         protocol: 'file:',
//         slashes: true
//       }));
//     }

//     this.mainWindow.on('closed', () => this.mainWindow = null);

//     // Hot Reloading
//     if (isDev) {
//       // 'node_modules/.bin/electronPath'
//       require('electron-reload')(__dirname, {
//         electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
//         forceHardReset: true,
//         hardResetMethod: 'exit'
//       });

//       // DevTools
//       installExtension(REACT_DEVELOPER_TOOLS)
//       .then((name: any) => log.verbose(`[Main] Added Extension:  ${name}`))
//       .catch((err: any) => log.verbose('[Main] An error occurred: ', err));

//       this.mainWindow.webContents.openDevTools();
//     }

//     this.mainWindow.webContents.on('did-finish-load', () => {
//       setTimeout(() => {
//         log.info('%c[Main] close Splash Window', 'color: blue');
//         this.splashWindow && this.splashWindow.destroy();
//         log.info('%c[Main] Show Main Window', 'color: blue');
//         this.mainWindow && this.mainWindow.maximize();
//       }, 3000);
//     });
//   }

//   private createSplashScreen() {
//     log.verbose('[Main] Creating splash Window config');
//     this.splashConfig = {
//       width: 500,
//       height: 500,
//       transparent: true,
//       frame: false,
//       alwaysOnTop: true,
//     };
//     log.info('%c[Main] Creating splash Window', 'color: blue');
//     this.splashWindow = new BrowserWindow(this.splashConfig);

//     this.splashWindow.on('closed', () => this.splashWindow = null);

//     this.splashWindow.center();
//     this.splashWindow.loadFile(path.join(__dirname, "screens/splash-screen.html"));
//   }

//   private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
//     ipcChannels.forEach(channel => {
//       log.verbose(`[Main] register Ipc Channel : ${channel.getName()}`);
//       ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request))
//     });
//   }

//   private onWindowAllClosed() {
//     if (process.platform !== 'darwin') {
//       app.quit();
//     }
//   }

//   private onActivate() {
//     if (!this.mainWindow) {
//       this.createWindow();
//     }
//   }
// }

// Here we go!
log.info('%c[Main] Starting app', 'color: blue');
try {
  let main = new Main();
  main.init();
} catch (error) {
  console.log('error at startup !');
}