import { app } from 'electron'
import path from 'path'
import fs from 'fs'

export class FileStorage {
  private static getStorageDir(): string {
    const userDataPath = app.getPath('userData')
    const storageDir = path.join(userDataPath, 'storage')
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true })
    }
    return storageDir
  }

  private static ensureDirectory(filePath: string): void {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  static readJson<T>(filename: string): T | null {
    try {
      const filePath = path.join(FileStorage.getStorageDir(), filename)
      if (!fs.existsSync(filePath)) {
        return null
      }
      const content = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(content) as T
    } catch (error) {
      console.error(`Error reading JSON file ${filename}:`, error)
      return null
    }
  }

  static writeJson<T>(filename: string, data: T): void {
    try {
      const filePath = path.join(FileStorage.getStorageDir(), filename)
      FileStorage.ensureDirectory(filePath)
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
      console.error(`Error writing JSON file ${filename}:`, error)
    }
  }

  static deleteFile(filename: string): void {
    try {
      const filePath = path.join(FileStorage.getStorageDir(), filename)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      console.error(`Error deleting file ${filename}:`, error)
    }
  }
}