import { app, BrowserWindow, Screen, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { promises as fs, existsSync } from 'fs';
import { execFile } from 'child_process';

const appFolder = path.join(app.getAppPath(), '/appDatas');
const obsFileFodlerPath = path.join(appFolder, '/obsFiles');

let appWindow: BrowserWindow;
let serve: boolean;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

// async function initWindow() {
async function initWindow() {

  try {
    await initAppFolderAndFiles();
    await startObs();
  } catch (error) {
    console.error(error);
  }

  const electronScreen: Screen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  appWindow = new BrowserWindow({
    // fullscreen: true,
    // x: 0,
    // y: 0,
    // width: 800,
    // height: 600,
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    // frame: false,
    title: 'Gones Streamer',
    backgroundColor: '#17242D',
    icon: path.join(__dirname, `/../../dist/assets/logos/logo-raw.png`),
    webPreferences: {
      nodeIntegration: true
    }
  });

  appWindow.removeMenu();

  // Electron Build Path
  appWindow.loadURL(
    url.format({
      // pathname: path.join(__dirname, `/dist/index.html`),
      pathname: path.join(__dirname, `/../../dist/index.html`),
      protocol: 'file:',
      slashes: true
    })
  );

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    appWindow.loadURL('http://localhost:4200');
    // Initialize the DevTools.
    appWindow.webContents.openDevTools({mode: 'undocked'});
  } else {
    appWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  appWindow.on('closed', () => {
    appWindow = null;
  });
}

async function initAppFolderAndFiles() {
  try {
    await fs.mkdir(obsFileFodlerPath, { recursive: true });
    if (!existsSync(path.join(appFolder, '/gameStatus.json'))) {
      await fs.writeFile(path.join(appFolder, '/gameStatus.json'), JSON.stringify({
        "awayTeam": {
          "city": "Ville Equipe Exterieur",
          "color": "#612323",
          "logo": "https://placekitten.com/450/450",
          "name": "Nom Equipe Exterieur",
          "score": 0,
          "timeout": 3
        },
        "homeTeam": {
          "city": "Ville Equipe Domicile",
          "color": "#133155",
          "logo": "https://placekitten.com/450/450",
          "name": "Nom Equipe Domicile",
          "score": 0,
          "timeout": 3
        }, null, 2));
    }
    if (!existsSync(path.join(appFolder, '/liveSettings.json'))) {
      await fs.writeFile(path.join(appFolder, '/liveSettings.json'), JSON.stringify({
        "bitrate": 5000,
        "buffer": 15,
        "streamKey": ""
      }, null, 2));
    }
  } catch (error) {
    console.error(error);
  }
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', async () => {
    try {
      await initWindow();
    } catch (error) {
      console.error(error);
    }
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (appWindow === null) {
      initWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}

ipcMain.on('getDataFiles', async (event, arg) => {
  // const files = await fs.readdir(appFolder);
  let datas: any = {};
  if (existsSync(path.join(appFolder, '/liveSettings.json'))) {
    let rawDataSettings = await fs.readFile(path.join(appFolder, '/liveSettings.json'), 'utf8');
    let settings = JSON.parse(rawDataSettings);
    datas.settings = settings;
  }
  if (existsSync(path.join(appFolder, '/gameStatus.json'))) {
    let rawDataGameSettings = await fs.readFile(path.join(appFolder, '/gameStatus.json'), 'utf8');
    let gameSettings = JSON.parse(rawDataGameSettings);
    datas.gameSettings = gameSettings;
  }
  appWindow.webContents.send('getDataFilesResponse', datas);
});

ipcMain.on('updateTeamInfo', async (event, arg) => {
  await fs.writeFile(path.join(appFolder, '/gameStatus.json'), JSON.stringify(arg, null, 2));
  appWindow.webContents.send('updateTeamInfoResponse', true);
});

ipcMain.on('resetTeamInfo', async (event, arg) => {
  await fs.writeFile(path.join(appFolder, '/gameStatus.json'), JSON.stringify({
    "awayTeam": {
      "city": "Ville Equipe Exterieur",
      "color": "#612323",
      "logo": "https://placekitten.com/450/450",
      "name": "Nom Equipe Exterieur",
      "score": 0,
      "timeout": 3
    },
    "homeTeam": {
      "city": "Ville Equipe Domicile",
      "color": "#133155",
      "logo": "https://placekitten.com/450/450",
      "name": "Nom Equipe Domicile",
      "score": 0,
      "timeout": 3
    }
  }, null, 2));
  appWindow.webContents.send('resetTeamInfoResponse', true);
});

async function startObs() {
  // console.log(__dirname);
  // console.log(path.join(app.getAppPath(), '/bin'));
  // console.log(path.join(__dirname, '/assets/OBS-Studio/bin/64bit/obs64.exe'));
  const executablePath = path.join(__dirname, '/assets/OBS-Studio/bin/64bit/obs64.exe');
  const parameters = [
    '--portable',
    '--minimize-to-tray',
    // '--collection "name"',
    // '--profile "name"',
    // '--scene "name"'
  ];

  try {
    await execFile(executablePath, parameters, { cwd: path.join(__dirname, '/assets/OBS-Studio/bin/64bit') });
  } catch (error) {
    console.error(error);
  }
}
