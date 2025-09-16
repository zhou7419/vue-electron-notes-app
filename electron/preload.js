// 预加载脚本，用于在渲染进程中安全地暴露Node.js和Electron API
import { contextBridge, ipcRenderer } from 'electron'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// 获取项目根目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '..')

// 数据库文件路径
const dbPath = path.join(projectRoot, 'src', 'database', 'notes.db')

// 通过contextBridge暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 窗口控制功能
  minimizeWindow: () => {
    ipcRenderer.send('window-control', 'minimize')
  },
  maximizeWindow: () => {
    ipcRenderer.send('window-control', 'maximize')
  },
  closeWindow: () => {
    ipcRenderer.send('window-control', 'close')
  },
  
  // SQLite数据库操作
  sqliteConnect: (customDbPath = null) => {
    try {
      const pathToUse = customDbPath || dbPath
      const db = new Database(pathToUse)

      // 创建表结构（如果不存在）
      db.exec(`
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT,
          folder_id INTEGER,
          is_deleted INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS folders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          parent_id INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `)

      db.close()
      return {
        success: true,
        message: '数据库连接成功',
        path: pathToUse
      }
    } catch (error) {
      return {
        success: false,
        message: `数据库连接失败: ${error.message}`,
        path: customDbPath || dbPath
      }
    }
  },

  // 获取数据库实例
  getDatabase: () => {
    try {
      const db = new Database(dbPath)

      // 添加获取所有文件夹的方法
      db.getAllFolders = () => {
        try {
          const folders = db.prepare('SELECT * FROM folders ORDER BY CASE WHEN parent_id IS NULL THEN 0 ELSE 1 END, name').all()
          return { success: true, data: folders, message: '获取文件夹成功' }
        } catch (error) {
          return { success: false, message: `获取文件夹失败: ${error.message}` }
        }
      }

      // 添加获取指定文件夹下笔记的方法
      db.getNotesByFolder = (folderId) => {
        try {
          const notes = db.prepare('SELECT * FROM notes WHERE folder_id = ? and is_deleted = 0 ORDER BY title').all(folderId)
          return { success: true, data: notes, message: '获取笔记成功' }
        } catch (error) {
          return { success: false, message: `获取笔记失败: ${error.message}` }
        }
      }

      // 添加保存笔记的方法
      db.saveNote = (noteData) => {
        try {
          const existingNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(noteData.id)

          if (existingNote) {
            const updateNote = db.prepare(
              'UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
            )
            updateNote.run(noteData.title, noteData.content, noteData.id)
            const updatedNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(noteData.id)
            return { success: true, data: updatedNote, message: '笔记保存成功' }
          } else {
            const insertNote = db.prepare(
              'INSERT INTO notes (title, content, folder_id) VALUES (?, ?, ?)'
            )
            const result = insertNote.run(noteData.title, noteData.content, noteData.folder_id)
            const newNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid)
            return { success: true, data: newNote, message: '笔记创建成功' }
          }
        } catch (error) {
          return { success: false, message: `保存笔记失败: ${error.message}` }
        }
      }

      // 添加创建文件夹的方法
      db.createFolder = (folderData) => {
        try {
          const insertFolder = db.prepare(
            'INSERT INTO folders (name, parent_id) VALUES (?, ?)'
          )
          const result = insertFolder.run(folderData.name, folderData.parent_id)
          const newFolder = db.prepare('SELECT * FROM folders WHERE id = ?').get(result.lastInsertRowid)
          return { success: true, data: newFolder, message: '文件夹创建成功' }
        } catch (error) {
          return { success: false, message: `创建文件夹失败: ${error.message}` }
        }
      }

      // 软删除笔记
      db.softDeleteNote = (noteId) => {
        try {
          const softDeleteNote = db.prepare('UPDATE notes SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_deleted = 0')
          const result = softDeleteNote.run(noteId)
          if (result.changes === 0) {
            return { success: false, message: '笔记不存在或已被删除' }
          }
          return { success: true, message: '笔记删除成功' }
        } catch (error) {
          return { success: false, message: `删除笔记失败: ${error.message}` }
        }
      }

      return db
    } catch (error) {
      console.error('数据库连接失败:', error)
      return null
    }
  }
})