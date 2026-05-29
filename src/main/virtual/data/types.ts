export interface IVServerSetting {
  port: number,
}

export enum EVCommandType {
  REGISTER = "REGISTER",
  SEND_INPUT = "SEND_INPUT",
  DELETE = "DELETE"
}

export enum EVControlType {
  AXIS = "AXIS",
  BUTTON = "BUTTON"
}

export interface IVCommandMessage {
  VCommandType: EVCommandType,
  VControlId: string,
  VControlType: EVControlType,
  axisValue?: number,
  buttonValue?: boolean,
}

export interface IEmulatorControlBind {
  name: string
  virtualControlId?: string
  virtualControlType: EVControlType
}

export interface IEmulator {
  id: string,
  controlBindList: IEmulatorControlBind[]
}

export interface IVControlBind {
  virtualControlId: string,
  emulatorId: string,
  emulatorControlName: string
}