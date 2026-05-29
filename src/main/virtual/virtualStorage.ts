import { FileStorage } from "../storage/fileStorage"
import { IEmulator, IVControlBind, IVServerSetting } from "./data/types"

export class VirtualStorage {
  static readonly SERVER_SETTING_FILE_NAME = "virtual_server_setting.json"
  static readonly EMULATOR_MAP_FILE_NAME = "virtual_emulator_map.json"
  static readonly VIRTUAL_CONTROL_BIND_FILE_NAME = "virtual_control_bind.json"
  static getServerSetting(): IVServerSetting | null {
    return FileStorage.readJson(VirtualStorage.SERVER_SETTING_FILE_NAME) as IVServerSetting | null
  }
  static setServerSetting(setting: IVServerSetting) {
    FileStorage.writeJson(VirtualStorage.SERVER_SETTING_FILE_NAME, setting)
  }
  static getEmulatorMap(): Map<string, IEmulator> {
    const obj = FileStorage.readJson<Record<string, IEmulator>>(VirtualStorage.EMULATOR_MAP_FILE_NAME)
    if (!obj) {
      return new Map()
    }
    const map = new Map<string, IEmulator>()
    for (const [key, value] of Object.entries(obj)) {
      map.set(key, value)
    }
    return map
  }
  static setEmulatorMap(map: Map<string, IEmulator>) {
    const obj: Record<string, IEmulator> = {}
    for (const [key, value] of map.entries()) {
      obj[key] = value
    }
    FileStorage.writeJson(VirtualStorage.EMULATOR_MAP_FILE_NAME, obj)
  }
  static getVirtualControlBindMap(): Map<string, IVControlBind> {
    const obj = FileStorage.readJson<Record<string, IVControlBind>>(VirtualStorage.VIRTUAL_CONTROL_BIND_FILE_NAME)
    if (!obj) {
      return new Map()
    }
    const map = new Map<string, IVControlBind>()
    for (const [key, value] of Object.entries(obj)) {
      map.set(key, value)
    }
    return map
  }
  static setVirtualControlBindMap(bind: Map<string, IVControlBind>) {
    const obj: Record<string, IVControlBind> = {}
    for (const [key, value] of bind.entries()) {
      obj[key] = value
    }
    FileStorage.writeJson(VirtualStorage.VIRTUAL_CONTROL_BIND_FILE_NAME, obj)
  }
}