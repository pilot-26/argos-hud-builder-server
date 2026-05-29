import { app, ipcMain } from 'electron'
import vigemclient from 'vigemclient'
import { X360Controller } from 'vigemclient/lib/X360Controller'
import { IControllerInput } from '../virtual/data/types'

let client = new vigemclient() 
client.connect()

let controller: X360Controller | null = null
ipcMain.handle("create-virtual-controller", () => {
  // Disconnect existing controller if present
  if (controller) {
    controller.disconnect()
  }
  controller = client.createX360Controller()
  controller.connect({vendorID: 0x045E, productID: 0x0280})
  // Set update mode to manual so we can update all at once
  controller.updateMode = "manual"
  return true
})

ipcMain.handle("send-input", async (_, input: IControllerInput) => {
  console.log("send-input")
  console.log(input)
  if (!controller) return
  
  controller.axis.leftTrigger.setValue(input.leftTrigger)
  controller.axis.rightTrigger.setValue(input.rightTrigger)
  controller.axis.leftX.setValue(input.leftX)
  controller.axis.leftY.setValue(input.leftY)
  controller.axis.rightX.setValue(input.rightX)
  controller.axis.rightY.setValue(input.rightY)
  controller.button.X.setValue(input.buttonX)
  controller.button.Y.setValue(input.buttonY)
  controller.button.A.setValue(input.buttonA)
  controller.button.B.setValue(input.buttonB)
  controller.button.START.setValue(input.buttonStart)
  controller.button.BACK.setValue(input.buttonBack)
  controller.button.LEFT_SHOULDER.setValue(input.leftBumper)
  controller.button.RIGHT_SHOULDER.setValue(input.rightBumper)
  controller.button.LEFT_THUMB.setValue(input.leftStick)
  controller.button.RIGHT_THUMB.setValue(input.rightStick)
  
  // Manually update after all inputs are set
  controller.update()
})