'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])



async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})





const { Menu, Tray,dialog } = require('electron')

let tray = null
app.whenReady().then(() => {

  Menu.setApplicationMenu(null)
  tray = new Tray('icon.jpg')
  tray.setToolTip('安全打印客户端')
  const contextMenu = Menu.buildFromTemplate([
    {
      label:"退出",
      click: function (){
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
  const win = BrowserWindow.getFocusedWindow();
  tray.on('double-click', function () {
    win.show();
  });

  const express = require('express')
  const exp = express()
  const port = 12383

  exp.get('/print_show', (req, res) => {
    win.show()
    res.send({    status: 'ok'  })
  })

  exp.listen(port)

  win.on("close", (event) => {
    if (dialog.showMessageBoxSync(win, {
      type: "info",
      buttons: ["最小化到托盘", "直接退出"],
      title: "提示",
      message: "确定要退出吗？",
      defaultId: 0,
      cancelId: 1
    }) === 0) {
      event.preventDefault();
      win.hide();
    } else {
      app.exit();
    }
  });

})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}