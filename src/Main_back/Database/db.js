import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';
//                        no explore %appdata%
const dbPath = path.join(app.getPath('userData'), 'tadalas.db');
const db = new Database(dbPath, { verbose: console.log });

export function initDatabase() {
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      produto TEXT NOT NULL
    );
  `);
  
  console.log('Banco de dados inicializado em:', dbPath);
}

export default db;