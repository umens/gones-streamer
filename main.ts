import { app, BrowserWindow, Screen, screen, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { promises as fs, existsSync } from 'fs';
import { execFile, ChildProcess } from 'child_process';
import { rootPath } from 'electron-root-path';
const isPackaged = require('electron-is-packaged').isPackaged;
const log = require('electron-log');

const extraResources = (isPackaged) ? path.join(rootPath, '/resources') : app.getAppPath();
const binFolder = path.join(extraResources, '/assets');
const appFolder = path.join(extraResources, '/appDatas')
const obsFileFodlerPath = path.join(appFolder, '/obsFiles');
const assetsFolderPath = path.join(appFolder, '/assetsFiles');
const assetsImagesFodlerPath = path.join(assetsFolderPath, '/teams');

let win: BrowserWindow = null;
const args = process.argv.slice(1);
let serve = args.some(val => val === '--serve');
let obsProcess: ChildProcess;

async function createWindow(): Promise<BrowserWindow> {

  try {
    log.info('initAppFolderAndFiles');
    await initAppFolderAndFiles();
    log.info('startObs');
    await startObs();
  } catch (error) {
    log.info('initWindow');
    log.error(error);
  }

  const electronScreen: Screen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    title: 'Gones Streamer',
    backgroundColor: '#17242D',
    icon: path.join(__dirname, `/../../dist/assets/logos/logo-raw.png`),
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
    // webPreferences: {
    //   nodeIntegration: true,
    //   allowRunningInsecureContent: (serve) ? true : false,
    // },
  });
  log.info('window create');

  win.removeMenu();
  log.info('remove menu');

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
    log.info('load front');
  }

  if (serve) {
    // win.webContents.openDevTools();
    win.webContents.openDevTools({mode: 'undocked'});
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', async () => {
    try {
      log.info('ready');
      await createWindow();
      log.info('created win');
    } catch (error) {
      log.info('main ready');
      log.error(error);
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

  app.on('activate', async () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      await createWindow();
    }
  });

} catch (e) {
  dialog.showErrorBox('', e)
  // Catch Error
  log.error(e);
  throw e;
}

/**
 * Standard functions
 */
async function initAppFolderAndFiles() {
  try {
    await fs.mkdir(obsFileFodlerPath, { recursive: true });
    await fs.mkdir(assetsFolderPath, { recursive: true });
    await fs.mkdir(assetsImagesFodlerPath, { recursive: true });
    if (!existsSync(path.join(appFolder, '/gameStatus.json'))) {
      await fs.writeFile(path.join(appFolder, '/gameStatus.json'), JSON.stringify({
        awayTeam: {
          city: 'Ville Equipe Exterieur',
          color: '#612323',
          logo: 'https://placekitten.com/450/450',
          name: 'Nom Equipe Exterieur',
          score: 0,
          timeout: 3
        },
        homeTeam: {
          city: 'Ville Equipe Domicile',
          color: '#133155',
          logo: 'https://placekitten.com/450/450',
          name: 'Nom Equipe Domicile',
          score: 0,
          timeout: 3
        },
        options: {
          quarter: 1,
          possession: 0,
          flag: false,
          showScoreboard: true,
        }

      }, null, 2));
      // await fs.writeFile(path.join(assetsFolderPath, '/awayName.txt'), 'Nom Equipe Exterieur');
      // await fs.writeFile(path.join(assetsFolderPath, '/awayCity.txt'), 'Ville Equipe Exterieur');
      // await fs.writeFile(path.join(assetsFolderPath, '/awayScore.txt'), '00');
      // await fs.writeFile(path.join(assetsFolderPath, '/homeName.txt'), 'Nom Equipe Domicile');
      // await fs.writeFile(path.join(assetsFolderPath, '/homeCity.txt'), 'Ville Equipe Domicile');
      // await fs.writeFile(path.join(assetsFolderPath, '/homeScore.txt'), '00');
    }
    if (!existsSync(path.join(appFolder, '/liveSettings.json'))) {
      await fs.writeFile(path.join(appFolder, '/liveSettings.json'), JSON.stringify({
        bitrate: 5000,
        buffer: 15,
        streamKey: ''
      }, null, 2));
    }
  } catch (error) {
    log.info('initAppFolderAndFiles files');
    log.error(error);
  }
}

async function startObs() {
  const executablePath = path.join(binFolder, '/OBS-Studio/bin/64bit/obs64.exe');
  const parameters = [
    '--portable',
    '--minimize-to-tray',
    '--collection "gones-streamer"',
    '--profile "gones-streamer"',
    '--scene "Starting"'
  ];

  try {

    log.info('starting obs ready');
    obsProcess = await execFile(executablePath, parameters, { cwd: path.join(binFolder, '/OBS-Studio/bin/64bit') });
    log.info('starting obs done');
  } catch (error) {
    log.info('startObs');
    log.error(error);
  }
}

/**
 * Ipc Events
 */
ipcMain.on('getDataFiles', async (event, arg) => {
  // const files = await fs.readdir(appFolder);
  const datas: any = {};
  if (existsSync(path.join(appFolder, '/liveSettings.json'))) {
    const rawDataSettings = await fs.readFile(path.join(appFolder, '/liveSettings.json'), 'utf8');
    const settings = JSON.parse(rawDataSettings);
    datas.settings = settings;
  }
  if (existsSync(path.join(appFolder, '/gameStatus.json'))) {
    const rawDataGameSettings = await fs.readFile(path.join(appFolder, '/gameStatus.json'), 'utf8');
    const gameSettings = JSON.parse(rawDataGameSettings);
    datas.gameSettings = gameSettings;
  }
  win.webContents.send('getDataFilesResponse', datas);
});

ipcMain.on('updateTeamInfo', async (event, arg) => {
  await fs.writeFile(path.join(appFolder, '/gameStatus.json'), JSON.stringify(arg, null, 2));
  // await fs.writeFile(path.join(assetsFolderPath, '/awayName.txt'), arg.awayTeam.name);
  // await fs.writeFile(path.join(assetsFolderPath, '/awayCity.txt'), arg.awayTeam.city);
  // const awayScore: string = '' + arg.awayTeam.score;
  // await fs.writeFile(path.join(assetsFolderPath, '/awayScore.txt'), awayScore.padStart(2, '0'));
  // await fs.writeFile(path.join(assetsFolderPath, '/homeName.txt'), arg.homeTeam.name);
  // await fs.writeFile(path.join(assetsFolderPath, '/homeCity.txt'), arg.homeTeam.city);
  // const homeScore: string = '' + arg.homeTeam.score;
  // await fs.writeFile(path.join(assetsFolderPath, '/homeScore.txt'), homeScore.padStart(2, '0'));
  win.webContents.send('updateTeamInfoResponse', true);
});

ipcMain.on('resetTeamInfo', async (event, arg) => {
  await fs.writeFile(path.join(appFolder, '/gameStatus.json'), JSON.stringify({
    awayTeam: {
      city: 'Ville Equipe Exterieur',
      color: '#612323',
      logo: 'https://placekitten.com/450/450',
      name: 'Nom Equipe Exterieur',
      score: 0,
      timeout: 3
    },
    homeTeam: {
      city: 'Ville Equipe Domicile',
      color: '#133155',
      logo: 'https://placekitten.com/450/450',
      name: 'Nom Equipe Domicile',
      score: 0,
      timeout: 3
    },
    options: {
      quarter: 1,
      possession: 0,
      flag: false,
      showScoreboard: true,
    }
  }, null, 2));
  // await fs.writeFile(path.join(assetsFolderPath, '/awayName.txt'), 'Nom Equipe Exterieur');
  // await fs.writeFile(path.join(assetsFolderPath, '/awayCity.txt'), 'Ville Equipe Exterieur');
  // await fs.writeFile(path.join(assetsFolderPath, '/awayScore.txt'), '00');
  // await fs.writeFile(path.join(assetsFolderPath, '/homeName.txt'), 'Nom Equipe Domicile');
  // await fs.writeFile(path.join(assetsFolderPath, '/homeCity.txt'), 'Ville Equipe Domicile');
  // await fs.writeFile(path.join(assetsFolderPath, '/homeScore.txt'), '00');
  win.webContents.send('resetTeamInfoResponse', true);
});

ipcMain.on('uploadTeamImage', async (event, arg: { path: string, name: string, isHomeTeam: boolean }) => {
  const rawDataGameSettings = await fs.readFile(path.join(appFolder, '/gameStatus.json'), 'utf8');
  const gameSettings = JSON.parse(rawDataGameSettings);

  const ext: string = arg.name.split('.').pop();
  let finalCopy: string;
  if (arg.isHomeTeam) {
    finalCopy = path.join(assetsImagesFodlerPath, '/home.' + ext);
    await fs.copyFile(arg.path, finalCopy);
    gameSettings.homeTeam.logo = finalCopy + '#' + new Date().getTime();
  } else {
    finalCopy = path.join(assetsImagesFodlerPath, '/away.' + ext);
    await fs.copyFile(arg.path, finalCopy);
    gameSettings.awayTeam.logo = finalCopy + '#' + new Date().getTime();
  }

  await fs.writeFile(path.join(appFolder, '/gameStatus.json'), JSON.stringify(gameSettings, null, 2));

  win.webContents.send('uploadTeamImageResponse', finalCopy + '#' + new Date().getTime());
});

ipcMain.on('setScoreboardSettings', async (event, arg: any) => {
  win.webContents.send('setScoreboardSettingsResponse', path.join(assetsFolderPath, '/scoreboard.html'));
});

ipcMain.on('setAnimationsSettings', async (event, arg: any) => {
  win.webContents.send('setAnimationsSettingsResponse', obsFileFodlerPath);
});

ipcMain.on('uploadBGImage', async (event, arg: { path: string, name: string }) => {

  const ext: string = arg.name.split('.').pop();
  let finalCopy: string;
  finalCopy = path.join(assetsFolderPath, '/bg.' + ext);
  await fs.copyFile(arg.path, finalCopy);

  win.webContents.send('uploadBGImageResponse', finalCopy);
});

ipcMain.on('updateGameOptions', async (event, arg: any) => {
  const rawDataGameSettings = await fs.readFile(path.join(appFolder, '/gameStatus.json'), 'utf8');
  const gameSettings = JSON.parse(rawDataGameSettings);

  gameSettings.options = arg;

  await fs.writeFile(path.join(appFolder, '/gameStatus.json'), JSON.stringify(gameSettings, null, 2));

  win.webContents.send('updateGameOptionsResponse', true);
});

ipcMain.on('updateScoreboardHTML', async (event, arg: string) => {
  await fs.writeFile(path.join(assetsFolderPath, '/scoreboard.html'), arg);

  win.webContents.send('updateScoreboardHTMLResponse', true);
});

// ipcMain.on('startReplay', async (event, arg: string) => {
//   // await startReplay();
//   const params = [
//     {
//       name: 'ApplicationTitle',
//       value: 'obs64',
//     },
//     {
//       name: 'Keys',
//       value: '{F10}',
//     }];
//   ps.addCommand(path.join(__dirname, '/assets/replayScriptWin.ps1'));
//   ps.addParameter(params[0]);
//   ps.addParameter(params[1]);
//   ps.invoke()
//   .then((output) => {
//     log.info(output);
//     // ps.addCommand('./script-loop.ps1');
//     // return ps.invoke();
//   });
//   win.webContents.send('startReplayResponse', true);
// });

ipcMain.on('getStreamSettingsOBS', async (event, arg: string) => {
  const rawStreamSettingsOBS = await fs.readFile(path.join(binFolder, '/OBS-Studio/config/obs-studio/basic/profiles/gonesstreamer/streamEncoder.json'), 'utf8');
  const streamSettingsOBS = JSON.parse(rawStreamSettingsOBS);
  win.webContents.send('getStreamSettingsOBSResponse', streamSettingsOBS);
});


ipcMain.on('setStreamSettingsOBS', async (event, arg: string) => {
  const rawStreamSettingsOBS = await fs.readFile(path.join(binFolder, '/OBS-Studio/config/obs-studio/basic/profiles/gonesstreamer/streamEncoder.json'), 'utf8');
  const streamSettingsOBS = JSON.parse(rawStreamSettingsOBS);
  streamSettingsOBS.bitrate = arg;
  await fs.writeFile(
    path.join(binFolder, '/OBS-Studio/config/obs-studio/basic/profiles/gonesstreamer/streamEncoder.json'),
    JSON.stringify(streamSettingsOBS, null, 2)
  );
  win.webContents.send('setStreamSettingsOBSResponse', true);
});
