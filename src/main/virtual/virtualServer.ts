import { Socket, createServer, Server } from "net"
import { EVCommandType, EVControlType, IEmulator, IVCommandMessage, IVControlBind } from "./data/types"
import { ipcMain } from "electron"
import { VirtualStorage } from "./virtualStorage"
import { X360Controller } from "vigemclient/lib/X360Controller"
import Vigemclient from "vigemclient"
import { VIRTUAL_CONST } from "./const/virtualConst"
import { v4 as uuidv4 } from 'uuid'

let vigemClient: Vigemclient | null = null

let emulatorMap: Map<string, IEmulator> = new Map()
let controllerMap: Map<string, X360Controller> = new Map()
let vControlBindMap: Map<string, IVControlBind> = new Map()
let server: Server | null = null

export const connectVigemClient = () => {
  if (vigemClient) {
    return
  }

  vigemClient = new Vigemclient()
  const event = vigemClient?.connect()
  if (event instanceof Error) {
    console.error("Vigem client connection error:", event.message)
    vigemClient = null
    throw new Error("Vigem client connection error")
  }
}

export const startServer = async (port: number) => {
  emulatorMap = VirtualStorage.getEmulatorMap() || new Map()
  vControlBindMap = VirtualStorage.getVirtualControlBindMap() || new Map()
  console.log("Emulator map:", JSON.stringify(emulatorMap))
  console.log("VControlBind map:", JSON.stringify(vControlBindMap))

  if (emulatorMap.size > 0) {
    connectVigemClient()
    Array.from(emulatorMap.entries()).forEach(([emulatorId, emulator]) => {
      const controller = vigemClient?.createX360Controller()
      if (!controller) {
        console.error("Failed to create X360 controller")
        throw new Error("Failed to create X360 controller")
      }
      controller.connect()
      controller.updateMode = "auto"
      controllerMap.set(emulatorId, controller)
    })
  }
  
  server = createServer(virtualListener)
  await new Promise<void>((resolve) => {
    server?.listen(port, () => {
      console.log(`Virtual Control server is running on port ${port}`)
      resolve()
    })
    server?.on("error", (err) => {
      console.error("Virtual Control server error:", err)
    })
    server?.on("close", () => {
      console.log("Virtual Control server closed")
    })
  })
}

export const stopServer = () => {
  server?.close()
  server = null
}
ipcMain.handle("virtual-start", async (event, port: number) => {
  await startServer(port)
})

ipcMain.handle("virtual-stop", (event) => {
  stopServer()
})

const register = (message: IVCommandMessage) => {
  if (vControlBindMap.has(message.VControlId)) {
    console.log("VControlBind already registered for control ID:", message.VControlId)
    return
  }

  let isFound = false
  let vControlBind: Partial<IVControlBind> = {
    virtualControlId: message.VControlId
  }

  Array.from(emulatorMap.entries()).forEach(([emulatorId, emulator]) => {
    for (const each of emulator.controlBindList) {
      if (!each.virtualControlId && each.virtualControlType === message.VControlType) {
        each.virtualControlId = message.VControlId
        isFound = true
        vControlBind.emulatorId = emulatorId
        vControlBind.emulatorControlName = each.name
        break
      }
      if (isFound) break
    }
  })

  if (!isFound) {
    const emulatorId = uuidv4()
    const newEmulator: IEmulator = {
      id: emulatorId,
      controlBindList: VIRTUAL_CONST.DEFAULT_CONTROL_LIST
    }
    newEmulator.controlBindList[0].virtualControlId = message.VControlId
    vControlBind.emulatorId = newEmulator.id
    vControlBind.emulatorControlName = newEmulator.controlBindList[0].name
    emulatorMap.set(newEmulator.id, newEmulator)
    VirtualStorage.setEmulatorMap(emulatorMap)
    
    connectVigemClient()
    const newController = vigemClient?.createX360Controller()
    if (newController) {
      newController.connect()
      newController.updateMode = "auto"
      controllerMap.set(emulatorId, newController)
    }
  }

  vControlBindMap.set(message.VControlId, vControlBind as IVControlBind)
}

export const input = async (message: IVCommandMessage) => {
  connectVigemClient()
  register(message)

  const vControlBind = vControlBindMap.get(message.VControlId)
  if (!vControlBind) {
    console.error("VControlBind not found for control ID:", message.VControlId)
    return
  }

  const controller = controllerMap.get(vControlBind.emulatorId)
  if (!controller) {
    console.error("Controller not found for emulator ID:", vControlBind.emulatorId)
    return
  }

  if (message.VControlType === EVControlType.AXIS) {
    if (message.axisValue === undefined) {
      console.error("Axis value is undefined for axis control")
      return
    }

    switch (vControlBind.emulatorControlName) {
      case VIRTUAL_CONST.LEFT_TRIGGER:
        controller.axis.leftTrigger.setValue(message.axisValue)
        break
      case VIRTUAL_CONST.RIGHT_TRIGGER:
        controller.axis.rightTrigger.setValue(message.axisValue)
        break
      case VIRTUAL_CONST.LEFT_Y:
        controller.axis.leftY.setValue(message.axisValue)
        break
      case VIRTUAL_CONST.RIGHT_Y:
        controller.axis.rightY.setValue(message.axisValue)
        break
      case VIRTUAL_CONST.LEFT_X:
        controller.axis.leftX.setValue(message.axisValue)
        break
      case VIRTUAL_CONST.RIGHT_X:
        controller.axis.rightX.setValue(message.axisValue)
        break
      default:
        console.error("Unknown axis control name:", vControlBind.emulatorControlName)
        break
    }
  }
  
  if (message.VControlType === EVControlType.BUTTON) {
    if (message.buttonValue === undefined) {
      console.error("Button value is undefined for button control")
      return
    }

    switch (vControlBind.emulatorControlName) {
      case VIRTUAL_CONST.A:
        controller.button.A.setValue(message.buttonValue)
        break
      case VIRTUAL_CONST.B:
        controller.button.B.setValue(message.buttonValue)
        break
      case VIRTUAL_CONST.X:
        controller.button.X.setValue(message.buttonValue)
        break
      case VIRTUAL_CONST.Y:
        controller.button.Y.setValue(message.buttonValue)
        break
      case VIRTUAL_CONST.START:
        controller.button.START.setValue(message.buttonValue)
        break
      case VIRTUAL_CONST.BACK:
        controller.button.BACK.setValue(message.buttonValue)
        break
      case VIRTUAL_CONST.LEFT_THUMB:
        controller.button.LEFT_THUMB.setValue(message.buttonValue)
        break
      case VIRTUAL_CONST.RIGHT_THUMB:
        controller.button.RIGHT_THUMB.setValue(message.buttonValue)
        break
      case VIRTUAL_CONST.LEFT_SHOULDER:
        controller.button.LEFT_SHOULDER.setValue(message.buttonValue)
        break
      case VIRTUAL_CONST.RIGHT_SHOULDER:
        controller.button.RIGHT_SHOULDER.setValue(message.buttonValue)
        break
    }
  }

  console.log(vControlBind.emulatorControlName)
  console.log(message.VControlType)
  console.log(message.axisValue)
  console.log(message.buttonValue)
  // controller.update()
}

export const virtualListener = (socket: Socket) => {
  let buffer = ""
  socket.on("data", (data) => {
    buffer += data.toString()
    let delimiterIndex
    while ((delimiterIndex = buffer.indexOf("#")) !== -1) {
      const messageStr = buffer.substring(0, delimiterIndex)
      buffer = buffer.substring(delimiterIndex + 1)
      if (messageStr) {
        try {
          const message = JSON.parse(messageStr) as IVCommandMessage
          switch (message.VCommandType) {
            case EVCommandType.REGISTER:
              console.log("Received REGISTER message:", message)
              register(message)
              break
            case EVCommandType.SEND_INPUT:
              console.log("Received SEND_INPUT message:", message)
              input(message)
              break
            case EVCommandType.DELETE:
              console.log("Received DELETE message:", message)
              break
          }
        } catch (err) {
          console.error("Error parsing message:", err)
        }
      }
    }
  })

  socket.on("close", () => {
    console.log("Client disconnected")
  })

  socket.on("error", (err) => {
    console.error("Client error:", err)
  })
}
