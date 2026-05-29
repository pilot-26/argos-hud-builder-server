import { IEmulatorControlBind, EVControlType } from "../data/types"

export class VIRTUAL_CONST {
  static readonly SERVER_PORT = 3001

  static readonly LEFT_TRIGGER = "LEFT_TRIGGER"
  static readonly RIGHT_TRIGGER = "RIGHT_TRIGGER"
  static readonly LEFT_X = "LEFT_X"
  static readonly LEFT_Y = "LEFT_Y"
  static readonly RIGHT_X = "RIGHT_X"
  static readonly RIGHT_Y = "RIGHT_Y"
  static readonly X = "X"
  static readonly Y = "Y"
  static readonly A = "A"
  static readonly B = "B"
  static readonly START = "START"
  static readonly BACK = "BACK"
  static readonly LEFT_SHOULDER = "LEFT_SHOULDER"
  static readonly RIGHT_SHOULDER = "RIGHT_SHOULDER"
  static readonly LEFT_THUMB = "LEFT_THUMB"
  static readonly RIGHT_THUMB = "RIGHT_THUMB"

  static readonly DEFAULT_CONTROL_LIST: IEmulatorControlBind[] = [
    {
      name: VIRTUAL_CONST.LEFT_TRIGGER,
      virtualControlId: undefined,
      virtualControlType: EVControlType.AXIS
    },
    {
      name: VIRTUAL_CONST.RIGHT_TRIGGER,
      virtualControlId: undefined,
      virtualControlType: EVControlType.AXIS
    },
    {
      name: VIRTUAL_CONST.LEFT_X,
      virtualControlId: undefined,
      virtualControlType: EVControlType.AXIS
    },
    {
      name: VIRTUAL_CONST.LEFT_Y,
      virtualControlId: undefined,
      virtualControlType: EVControlType.AXIS
    },
    {
      name: VIRTUAL_CONST.RIGHT_X,
      virtualControlId: undefined,
      virtualControlType: EVControlType.AXIS
    },
    {
      name: VIRTUAL_CONST.RIGHT_Y,
      virtualControlId: undefined,
      virtualControlType: EVControlType.AXIS
    },
    {
      name: VIRTUAL_CONST.X,
      virtualControlId: undefined,
      virtualControlType: EVControlType.BUTTON
    },
    {
      name: VIRTUAL_CONST.Y,
      virtualControlId: undefined,
      virtualControlType: EVControlType.BUTTON
    },
    {
      name: VIRTUAL_CONST.A,
      virtualControlId: undefined,
      virtualControlType: EVControlType.BUTTON
    },
    {
      name: VIRTUAL_CONST.B,
      virtualControlId: undefined,
      virtualControlType: EVControlType.BUTTON
    },
    {
      name: VIRTUAL_CONST.START,
      virtualControlId: undefined,
      virtualControlType: EVControlType.BUTTON
    },
    {
      name: VIRTUAL_CONST.BACK,
      virtualControlId: undefined,
      virtualControlType: EVControlType.BUTTON
    },
    {
      name: VIRTUAL_CONST.LEFT_SHOULDER,
      virtualControlId: undefined,
      virtualControlType: EVControlType.BUTTON
    },
    {
      name: VIRTUAL_CONST.RIGHT_SHOULDER,
      virtualControlId: undefined,
      virtualControlType: EVControlType.BUTTON
    },
    {
      name: VIRTUAL_CONST.LEFT_THUMB,
      virtualControlId: undefined,
      virtualControlType: EVControlType.BUTTON
    },
    {
      name: VIRTUAL_CONST.RIGHT_THUMB,
      virtualControlId: undefined,
      virtualControlType: EVControlType.BUTTON
    },
  ]
}