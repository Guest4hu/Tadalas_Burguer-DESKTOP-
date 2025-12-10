import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';

const dbPath = path.join(app.getPath('userData'), 'kipedreiro.db');
const db = new Database(dbPath, { verbose: console.log });

export function initDatabase() {
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT, 
      nome_usuario TEXT NOT NULL,
      email_usuario TEXT NOT NULL,
      telefone_usuario TEXT,
      tipo_usuario TEXT NOT NULL,
      sync_status INTEGER DEFAULT 0, -- 0 = Pendente, 1 = Sincronizado
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME,
      excluido_em DATETIME -- Se estiver preenchido, o registro foi "deletado"
    );
    CREATE TABLE IF NOT EXISTS produtos (
    produto_id INTERGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    produto_nome TEXT NOT NULL,
    produto_descricao TEXT NOT NULL,     
    produto_preco NUMERIC NOT NULL,
    
    )
  
  
    `);
  
  console.log('Banco de dados inicializado em:', dbPath);
}

export default db;