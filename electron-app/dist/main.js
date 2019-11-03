"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var appWindow;
function initWindow() {
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    appWindow = new electron_1.BrowserWindow({
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
        icon: path.join(__dirname, "/../../dist/assets/logos/logo-raw.png"),
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Electron Build Path
    appWindow.loadURL(url.format({
        // pathname: path.join(__dirname, `/dist/index.html`),
        pathname: path.join(__dirname, "/../../dist/index.html"),
        protocol: 'file:',
        slashes: true
    }));
    // Initialize the DevTools.
    appWindow.webContents.openDevTools();
    appWindow.on('closed', function () {
        appWindow = null;
    });
}
try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    electron_1.app.on('ready', initWindow);
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (appWindow === null) {
            initWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
//# sourceMappingURL=main.js.map