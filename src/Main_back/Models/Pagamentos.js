import db from '../Database/db.js';
import crypto from 'node:crypto';

class Pagamentos {

async adicionar(pagamento) {
    const uuid = crypto.randomUUID();

    return db.prepare(`
      INSERT INTO tbl_pagamento
      (uuid, pedido_id, metodo, status_pagamento_id, valor_total, sincronizado_em)
      VALUES (?, ?, ?, ?, ?, 0)
    `).run(
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

  async buscarPorUUID(uuid) {
    return db.prepare(`
      SELECT * FROM tbl_pagamento 
      WHERE uuid = ? AND excluido_em IS NULL
    `).get(uuid);
  }

  async marcarComoSincronizado(uuid) {
    return db.prepare(`
      UPDATE tbl_pagamento SET sincronizado_em = 1
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }
}

export default Pagamentos;
