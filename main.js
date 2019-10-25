const {
  app,
  BrowserWindow
} = require('electron')
const url = require("url");
const path = require("path");

var execOBS = require(path.join(__dirname, './lib/spawn-obs.js'))
var child = require('child_process').execFile;

let appObs;
let appWindow;

function initWindow() {

  appWindow = new BrowserWindow({
    // fullscreen: true,
    // x: 0,
    // y: 0,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Electron Build Path
  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  // Initialize the DevTools.
  appWindow.webContents.openDevTools()

  appWindow.on('closed', function () {
    appWindow = null;
  })
}

app.on('ready', function() {
  // execOBS('-p');

  // var winOBS = path.join(__dirname, '/assets/OBS-Studio/bin/64bit/obs64.exe');
  var winOBS = path.join(__dirname, '/assets/OBSPortable/OBSPortable.exe');
  console.log(winOBS);
  appObs = child(winOBS, ['-p', '--minimize-to-tray'], function(err, data) {
    console.log(err)
    console.log(data.toString());
  });
  initWindow();
});

// Close when all windows are closed.
app.on('window-all-closed', function () {

  // appObs.kill('SIGSTOP');

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  if (win === null) {
    initWindow();
  }
})
