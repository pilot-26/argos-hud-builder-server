import { contextBridge, ipcRenderer } from 'electron'
import { IControllerInput } from './virtual/data/types'

declare global {
  const SHOW_CONSOLE = false
  interface Window {
    api: {
      send: (channel: string, data: any) => void
      receive: (channel: string, func: (...args: any[]) => void) => void
      minimizeWindow: () => Promise<void>
      maximizeWindow: () => Promise<void>
      closeWindow: () => Promise<void>
      isWindowMaximized: () => Promise<boolean>
    },
    virtual: {
      createController: () => Promise<number>
      sendInput: (id: string, input: IControllerInput) => Promise<number>
    }
  }
}

contextBridge.exposeInMainWorld('api', {
  send: (channel: string, data: any) => {
    const validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel: string, func: (...args: any[]) => void) => {
    const validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  isWindowMaximized: () => ipcRenderer.invoke('is-window-maximized'),
})

contextBridge.exposeInMainWorld('virtual', {
  createController: () => ipcRenderer.invoke('create-virtual-controller'),
  sendInput: (id: string, input: IControllerInput) => ipcRenderer.invoke('send-input', input),
})