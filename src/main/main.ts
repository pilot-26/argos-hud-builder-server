import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import "./virtual/virtualServer"
import path from 'path'
import { MAIN_CONST } from './const/mainConst'
import { startServer } from './virtual/virtualServer'
import { VIRTUAL_CONST } from './virtual/const/virtualConst'

const isDev = !app.isPackaged
if (require('electron-squirrel-startup')) {
  app.quit()
}

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
const createMainWindow = () => {
  if (mainWindow) {
    mainWindow.focus()
  } else {
    mainWindow = new BrowserWindow({
      width: 300,
      height: 500,
      minWidth: 300,
      minHeight: 500,
      resizable: true,
      frame: true,
      webPreferences: {
        partition: 'persist:argos-server',
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '..', 'preload.js'),
      },
    })

    if (isDev) {
      mainWindow.loadURL('http://localhost:5175')
      if (MAIN_CONST.SHOW_CONSOLE) {
        mainWindow.webContents.openDevTools()
      }
    } else {
      mainWindow.loadFile(path.join(__dirname, '../../renderer/index.html'))
    }

    mainWindow.center()
    mainWindow.show()

    mainWindow.on('close', () => {
      mainWindow = null
    })
  }
}

const createTray = () => {
  const iconPath = isDev
    ? path.join(__dirname, '..', '..', 'assets', 'icon-16.png')
    : path.join(process.resourcesPath, 'assets', 'icon-16.png')
  console.log('Icon path:', iconPath)
  try {
    tray = new Tray(iconPath)
    tray.setToolTip('Argos Server')
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'ARGOS Server',
        type: "normal",
        icon: iconPath,
        click: () => createMainWindow()
      },
      {
        type: "separator"
      },
      {
        label: 'Exit',
        role: 'quit',
        type: "normal",
        click: () => app.quit()
      }
    ])
    tray.setContextMenu(contextMenu)
    tray.on('double-click', () => {
      createMainWindow()
    })
  } catch (err) {
    console.error('Tray error:', err)
  }
}

app.disableHardwareAcceleration()
app.on('window-all-closed', () => {
  mainWindow = null
})

app.whenReady().then(() => {
  createTray()
  Menu.setApplicationMenu(null)
  startServer(VIRTUAL_CONST.SERVER_PORT)
})