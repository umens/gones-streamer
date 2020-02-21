import { app, BrowserWindow, Screen, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { promises as fs, existsSync } from 'fs';
import { execFile, ChildProcess } from 'child_process';
// import NodePowershell from 'node-powershell';
import * as shell from 'node-powershell';

const ps = new shell({
  executionPolicy: 'Bypass',
  noProfile: true
});

const binFolder = path.join(app.getAppPath(), '/assets');
const appFolder = path.join(app.getAppPath(), '/appDatas');
const obsFileFodlerPath = path.join(appFolder, '/obsFiles');
const assetsFolderPath = path.join(appFolder, '/assetsFiles');
const assetsImagesFodlerPath = path.join(assetsFolderPath, '/teams');

let appWindow: BrowserWindow;
let obsProcess: ChildProcess;
let serve: boolean;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

// async function initWindow() {
async function initWindow() {

  try {
    await initAppFolderAndFiles();
    await startObs();
  } catch (error) {
    console.log('initWindow');
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
      nodeIntegration: true,
      webSecurity: false
    }
  });

  appWindow.removeMenu();

  // Electron Build Path
  // appWindow.loadURL(
  //   url.format({
  //     // pathname: path.join(__dirname, `/dist/index.html`),
  //     pathname: path.join(__dirname, `/../../dist/index.html`),
  //     protocol: 'file:',
  //     slashes: true
  //   })
  // );

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
      await fs.writeFile(path.join(assetsFolderPath, '/awayName.txt'), 'Nom Equipe Exterieur');
      await fs.writeFile(path.join(assetsFolderPath, '/awayCity.txt'), 'Ville Equipe Exterieur');
      await fs.writeFile(path.join(assetsFolderPath, '/awayScore.txt'), '00');
      await fs.writeFile(path.join(assetsFolderPath, '/homeName.txt'), 'Nom Equipe Domicile');
      await fs.writeFile(path.join(assetsFolderPath, '/homeCity.txt'), 'Ville Equipe Domicile');
      await fs.writeFile(path.join(assetsFolderPath, '/homeScore.txt'), '00');
    }
    if (!existsSync(path.join(appFolder, '/liveSettings.json'))) {
      await fs.writeFile(path.join(appFolder, '/liveSettings.json'), JSON.stringify({
        bitrate: 5000,
        buffer: 15,
        streamKey: ''
      }, null, 2));
    }
  } catch (error) {
    console.log('initAppFolderAndFiles files');
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
      console.log('main ready');
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
  console.log('main');
  console.error(e);
}

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
  appWindow.webContents.send('getDataFilesResponse', datas);
});

ipcMain.on('updateTeamInfo', async (event, arg) => {
  await fs.writeFile(path.join(appFolder, '/gameStatus.json'), JSON.stringify(arg, null, 2));
  await fs.writeFile(path.join(assetsFolderPath, '/awayName.txt'), arg.awayTeam.name);
  await fs.writeFile(path.join(assetsFolderPath, '/awayCity.txt'), arg.awayTeam.city);
  const awayScore: string = '' + arg.awayTeam.score;
  await fs.writeFile(path.join(assetsFolderPath, '/awayScore.txt'), awayScore.padStart(2, '0'));
  await fs.writeFile(path.join(assetsFolderPath, '/homeName.txt'), arg.homeTeam.name);
  await fs.writeFile(path.join(assetsFolderPath, '/homeCity.txt'), arg.homeTeam.city);
  const homeScore: string = '' + arg.homeTeam.score;
  await fs.writeFile(path.join(assetsFolderPath, '/homeScore.txt'), homeScore.padStart(2, '0'));
  appWindow.webContents.send('updateTeamInfoResponse', true);
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
  await fs.writeFile(path.join(assetsFolderPath, '/awayName.txt'), 'Nom Equipe Exterieur');
  await fs.writeFile(path.join(assetsFolderPath, '/awayCity.txt'), 'Ville Equipe Exterieur');
  await fs.writeFile(path.join(assetsFolderPath, '/awayScore.txt'), '00');
  await fs.writeFile(path.join(assetsFolderPath, '/homeName.txt'), 'Nom Equipe Domicile');
  await fs.writeFile(path.join(assetsFolderPath, '/homeCity.txt'), 'Ville Equipe Domicile');
  await fs.writeFile(path.join(assetsFolderPath, '/homeScore.txt'), '00');
  appWindow.webContents.send('resetTeamInfoResponse', true);
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

  appWindow.webContents.send('uploadTeamImageResponse', finalCopy + '#' + new Date().getTime());
});

ipcMain.on('uploadBGImage', async (event, arg: { path: string, name: string }) => {

  const ext: string = arg.name.split('.').pop();
  let finalCopy: string;
  finalCopy = path.join(assetsFolderPath, '/bg.' + ext);
  await fs.copyFile(arg.path, finalCopy);

  appWindow.webContents.send('uploadBGImageResponse', finalCopy);
});

ipcMain.on('updateGameOptions', async (event, arg: any) => {
  const rawDataGameSettings = await fs.readFile(path.join(appFolder, '/gameStatus.json'), 'utf8');
  const gameSettings = JSON.parse(rawDataGameSettings);

  gameSettings.options = arg;

  await fs.writeFile(path.join(appFolder, '/gameStatus.json'), JSON.stringify(gameSettings, null, 2));

  appWindow.webContents.send('updateGameOptionsResponse', true);
});

ipcMain.on('updateScoreboardHTML', async (event, arg: string) => {
  await fs.writeFile(path.join(assetsFolderPath, '/scoreboard.html'), arg);

  appWindow.webContents.send('updateScoreboardHTMLResponse', true);
});

ipcMain.on('startReplay', async (event, arg: string) => {
  // await startReplay();
  const params = [
    {
      name: 'ApplicationTitle',
      value: 'obs64',
    },
    {
      name: 'Keys',
      value: '{F10}',
    }];
  ps.addCommand(path.join(__dirname, '/assets/replayScriptWin.ps1'));
  ps.addParameter(params[0]);
  ps.addParameter(params[1]);
  ps.invoke()
  .then((output) => {
    console.log(output);
    // ps.addCommand('./script-loop.ps1');
    // return ps.invoke();
  });
  appWindow.webContents.send('startReplayResponse', true);
});

ipcMain.on('getStreamSettingsOBS', async (event, arg: string) => {
  const rawStreamSettingsOBS = await fs.readFile(path.join(binFolder, '/OBS-Studio/config/obs-studio/basic/profiles/gonesstreamer/streamEncoder.json'), 'utf8');
  const streamSettingsOBS = JSON.parse(rawStreamSettingsOBS);
  appWindow.webContents.send('getStreamSettingsOBSResponse', streamSettingsOBS);
});


ipcMain.on('setStreamSettingsOBS', async (event, arg: string) => {
  const rawStreamSettingsOBS = await fs.readFile(path.join(binFolder, '/OBS-Studio/config/obs-studio/basic/profiles/gonesstreamer/streamEncoder.json'), 'utf8');
  const streamSettingsOBS = JSON.parse(rawStreamSettingsOBS);
  streamSettingsOBS.bitrate = arg;
  await fs.writeFile(
    path.join(binFolder, '/OBS-Studio/config/obs-studio/basic/profiles/gonesstreamer/streamEncoder.json'),
    JSON.stringify(streamSettingsOBS, null, 2)
  );
  appWindow.webContents.send('setStreamSettingsOBSResponse', true);
});

async function startObs() {
  // console.log(__dirname);
  // console.log(path.join(app.getAppPath(), '/bin'));
  // console.log(path.join(__dirname, '/assets/OBS-Studio/bin/64bit/obs64.exe'));
  const executablePath = path.join(__dirname, '/assets/OBS-Studio/bin/64bit/obs64.exe');
  const parameters = [
    '--portable',
    '--minimize-to-tray',
    '--collection "gones-streamer"',
    '--profile "gones-streamer"',
    '--scene "Starting"'
  ];

  try {
    obsProcess = await execFile(executablePath, parameters, { cwd: path.join(__dirname, '/assets/OBS-Studio/bin/64bit') });
  } catch (error) {
    console.log('startObs');
    console.error(error);
  }
}


// async function startReplay() {
//   try {
//     // obsProcess.stdin.write('\x1b[21~', (err) => {
//     //   if (err) {
//     //     console.log(err);
//     //   }
//     // });
//     console.log('send');
//     // scriptPath = path.join(assetsFolderPath, '/homeScore.txt')
//     await ps.addCommand(`${path.join(__dirname, '/assets/replayScriptWin.ps1')}`);
//     // await ps.addCommand(`${path.join(__dirname, '/assets/replayScriptWin.ps1')} "obs64" "{f10}"`);
//     // await ps.addArgument('"obs64"');
//     // await ps.addArgument('"{f10}"');
//     await ps.invoke();
//     console.log('sended');
//     // replayScriptWin.ps1 "obs64" "{f10}"
//   } catch (error) {
//     console.log('startReplay');
//     console.error(error);
//     ps.dispose();
//   }
// }
