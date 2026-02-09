import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';
//                        no explore %appdata%
const dbPath = path.join(app.getPath('userData'), 'tadalas.db');
const db = new Database(dbPath, { verbose: console.log });

export function initDatabase() {

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS dom_tipo_usuario (
  id INTEGER PRIMARY KEY UNIQUE,
  uuid TEXT UNIQUE,
  descricao TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS dom_tipo_pedido (
  id INTEGER PRIMARY KEY UNIQUE,
  uuid TEXT UNIQUE,
  descricao_tipo TEXT NOT NULL UNIQUE
);

    CREATE TABLE IF NOT EXISTS dom_status_pagamento (
  id INTEGER PRIMARY KEY UNIQUE,
  uuid TEXT UNIQUE,
  descricao TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS dom_metodo_pagamento (
  id INTEGER PRIMARY KEY UNIQUE,
  uuid TEXT UNIQUE,
  descricao_metodo TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS dom_status_pedido (
    id INTEGER PRIMARY KEY UNIQUE,
    uuid TEXT UNIQUE,
    descricao TEXT NOT NULL UNIQUE,
    criado_em DATETIME,
    atualizado_em DATETIME,
    excluido_em DATETIME
);






   CREATE TABLE IF NOT EXISTS tbl_usuarios (
  usuario_id INTEGER PRIMARY KEY UNIQUE,
  uuid TEXT UNIQUE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  telefone TEXT,

  tipo_usuario_id INTEGER NOT NULL,

  criado_em DATETIME NOT NULL DEFAULT (datetime('now')),
  atualizado_em DATETIME,
  excluido_em DATETIME,
  sincronizado_em INTEGER DEFAULT 0,

  FOREIGN KEY (tipo_usuario_id)
    REFERENCES dom_tipo_usuario(id)
);



CREATE TABLE IF NOT EXISTS tbl_pedidos (
  pedido_id INTEGER PRIMARY KEY UNIQUE,
  uuid TEXT UNIQUE,

  usuario_id INTEGER NOT NULL,
  status_pedido_id INTEGER NOT NULL,
  tipo_pedido INTEGER NOT NULL,

  criado_em DATETIME NOT NULL DEFAULT (datetime('now')),
  atualizado_em DATETIME,
  excluido_em DATETIME,
  sincronizado_em INTEGER DEFAULT 0,

  FOREIGN KEY (usuario_id)
    REFERENCES tbl_usuarios(usuario_id),

  FOREIGN KEY (status_pedido_id)
    REFERENCES dom_status_pedido(id),

  FOREIGN KEY (tipo_pedido)
    REFERENCES dom_tipo_pedido(id)
);



CREATE TABLE IF NOT EXISTS tbl_enderecos (
  endereco_id INTEGER PRIMARY KEY UNIQUE,
  uuid TEXT UNIQUE,

  usuario_id INTEGER NOT NULL,

  rua TEXT NOT NULL,
  numero TEXT NOT NULL,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  cep TEXT NOT NULL,

  criado_em DATETIME NOT NULL DEFAULT (datetime('now')),
  atualizado_em DATETIME,
  excluido_em DATETIME,
  sincronizado_em INTEGER DEFAULT 0,

  FOREIGN KEY (usuario_id)
    REFERENCES tbl_usuarios(usuario_id)
);




CREATE TABLE IF NOT EXISTS tbl_categoria (
  id_categoria INTEGER PRIMARY KEY UNIQUE,
  uuid TEXT UNIQUE,

  nome TEXT NOT NULL,
  descricao TEXT,

  criado_em DATETIME NOT NULL DEFAULT (datetime('now')),
  atualizado_em DATETIME,
  excluido_em DATETIME,
  sincronizado_em INTEGER DEFAULT 0
);



CREATE TABLE IF NOT EXISTS tbl_produtos (
  produto_id INTEGER PRIMARY KEY UNIQUE,
  uuid TEXT UNIQUE,

  nome TEXT NOT NULL,
  descricao TEXT,
  preco NUMERIC(10,2) NOT NULL,
  estoque INTEGER NOT NULL DEFAULT 0,

  categoria_id INTEGER NOT NULL,
  foto_produto TEXT,

  criado_em DATETIME NOT NULL DEFAULT (datetime('now')),
  atualizado_em DATETIME,
  excluido_em DATETIME,
  sincronizado_em INTEGER DEFAULT 0,

  FOREIGN KEY (categoria_id)
    REFERENCES tbl_categoria(id_categoria)
);



CREATE TABLE IF NOT EXISTS tbl_pagamento (
  pagamento_id INTEGER PRIMARY KEY UNIQUE,
  uuid TEXT UNIQUE,

  pedido_id INTEGER NOT NULL,
  metodo INTEGER NOT NULL,
  status_pagamento_id INTEGER NOT NULL,
  valor_total NUMERIC(10,2) NOT NULL,

  criado_em DATETIME NOT NULL DEFAULT (datetime('now')),
  atualizado_em DATETIME,
  excluido_em DATETIME,
  sincronizado_em INTEGER DEFAULT 0,

  FOREIGN KEY (pedido_id)
    REFERENCES tbl_pedidos(pedido_id),

  FOREIGN KEY (metodo)
    REFERENCES dom_metodo_pagamento(id),

  FOREIGN KEY (status_pagamento_id)
    REFERENCES dom_status_pagamento(id)
);



CREATE TABLE IF NOT EXISTS tbl_itens_pedidos (
  item_id INTEGER PRIMARY KEY UNIQUE,
  uuid TEXT UNIQUE,

  pedido_id INTEGER NOT NULL,
  produto_id INTEGER NOT NULL,

  quantidade INTEGER NOT NULL DEFAULT 1,
  valor_unitario NUMERIC(10,2) NOT NULL,

  criado_em DATETIME NOT NULL DEFAULT (datetime('now')),
  atualizado_em DATETIME,
  excluido_em DATETIME,
  sincronizado_em INTEGER DEFAULT 0,

  FOREIGN KEY (pedido_id)
    REFERENCES tbl_pedidos(pedido_id),

  FOREIGN KEY (produto_id)
    REFERENCES tbl_produtos(produto_id)
);

`
);

}

export default db;