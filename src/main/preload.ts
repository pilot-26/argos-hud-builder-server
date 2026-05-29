import { contextBridge, ipcRenderer } from 'electron'

declare global {
  const SHOW_CONSOLE = false
  interface Window {
    api: {
      send: (channel: string, data: any) => void
      receive: (channel: string, func: (...args: any[]) => void) => void
    },
    virtual: {
      start: (number: number) => Promise<void>
      stop: () => Promise<void>
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
})

contextBridge.exposeInMainWorld('virtual', {
  start: (number: number) => ipcRenderer.invoke('virtual-start', number),
  stop: () => ipcRenderer.invoke('virtual-stop'),
})