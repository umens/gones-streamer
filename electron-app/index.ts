import { app, BrowserWindow, Screen, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';

let appWindow: BrowserWindow;

function initWindow() {

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
    backgroundColor: '#ffffff',
    icon: path.join(__dirname, `/../../dist/assets/logos/logo-raw.png`),
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Electron Build Path
  appWindow.loadURL(
    url.format({
      // pathname: path.join(__dirname, `/dist/index.html`),
      pathname: path.join(__dirname, `/../../dist/index.html`),
      protocol: 'file:',
      slashes: true
    })
  );

  // Initialize the DevTools.
  appWindow.webContents.openDevTools();

  appWindow.on('closed', () => {
    appWindow = null;
  });
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', initWindow);

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

ipcMain.on('getFiles', (event, arg) => {
  const files = fs.readdirSync(__dirname);
  appWindow.webContents.send('getFilesResponse', files);
});
