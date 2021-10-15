require("dotenv").config();

const { app, BrowserWindow } = require("electron");

const server = require("./app"); //ADD THIS

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + "/icon.ico",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // mainWindow.webContents.openDevTools();
  mainWindow.removeMenu();

  mainWindow.loadURL("http://localhost:3000"); //ADD THIS
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("resize", function (e, x, y) {
  mainWindow.setSize(x, y);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// app.on("activate", function () {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

// try {
//   require('electron-reloader')(module)
// } catch (_) {}
