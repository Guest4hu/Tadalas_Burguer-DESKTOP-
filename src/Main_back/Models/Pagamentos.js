import db from '../Database/db.js';
import crypto from 'node:crypto';

class Pagamentos {

async adicionar(pagamento) {
    const uuid = crypto.randomUUID();

    return db.prepare(`
      INSERT OR IGNORE INTO tbl_pagamento
      (pagamento_id, uuid, pedido_id, metodo, status_pagamento_id, valor_total, sincronizado_em)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `).run(
      pagamento.pagamento_id,
      uuid,
      pagamento.pedido_id,
      pagamento.metodo,
      pagamento.status_pagamento_id,
      pagamento.valor_total
    ).lastInsertRowid;
  }

  async listar() {
    return db.prepare(`
      SELECT * FROM tbl_pagamento WHERE excluido_em IS NULL
    `).all();
  }

  async listarPendentes() {
    return db.prepare(`
      SELECT * FROM tbl_pagamento 
      WHERE sincronizado_em = 0 AND excluido_em IS NULL
    `).all();
  }

  async buscarPorID(pagamento_id) {
    let stmt = db.prepare(`
      SELECT pagamento_id FROM tbl_pagamento 
      WHERE pagamento_id = ? AND excluido_em IS NULL
    `).get(pagamento_id);
    stmt ??= { pagamento_id: 0 };
    if (stmt.pagamento_id > 0) {
      return true;
    } else {
      return false;
    }
  }

  async marcarComoSincronizado(uuid) {
    return db.prepare(`
      UPDATE tbl_pagamento SET sincronizado_em = 1
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }
}

export default Pagamentos;
