import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import path from 'path'
import { MAIN_CONST } from '../const/mainConst'

const isDev = !app.isPackaged

export let mainWindow: BrowserWindow | null = null
export const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    minWidth: 600,
    minHeight: 400,
    resizable: true,
    frame: true,
    webPreferences: {
      partition: 'persist:argos',
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
}

ipcMain.handle('minimize-window', () => {
  mainWindow?.minimize()
})

ipcMain.handle('maximize-window', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow?.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.handle('close-window', () => {
  mainWindow?.close()
})

ipcMain.handle('is-window-maximized', () => {
  return mainWindow?.isMaximized() || false
})