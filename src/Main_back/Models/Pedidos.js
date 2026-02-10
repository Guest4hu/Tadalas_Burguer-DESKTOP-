import db from '../Database/db.js';
import crypto from 'node:crypto';

class Pedidos {

 async adicionar(pedido) {
    const uuid = crypto.randomUUID();
    return db.prepare(`
     INSERT OR IGNORE INTO tbl_pedidos
      (uuid, usuario_id, status_pedido_id, tipo_pedido, sincronizado_em)
      VALUES (?, ?, ?, ?, 0)
    `).run(
      uuid,
      pedido.usuario_id,
      pedido.status_pedido_id,
      pedido.tipo_pedido
    ).lastInsertRowid;
  }

  async listar() {
    return db.prepare(`
      SELECT * FROM tbl_pedidos WHERE excluido_em IS NULL
    `).all();
  }

  async listarPendentes() {
    return db.prepare(`
      SELECT * FROM tbl_pedidos 
      WHERE sincronizado_em = 0 AND excluido_em IS NULL
    `).all();
  }

  async listarSincronizados() {
    return db.prepare(`
      SELECT * FROM tbl_pedidos 
      WHERE sincronizado_em = 1 AND excluido_em IS NULL
    `).all();
  }

  async buscarPorID(pedido_id) {
    let stmt = db.prepare(`
      SELECT pedido_id FROM tbl_pedidos 
      WHERE pedido_id = ? AND excluido_em IS NULL
    `).get(pedido_id);
    stmt ??= { pedido_id: 0 };
    if (stmt.pedido_id > 0) {
      return true;
    } else {
      return false;
    }
  }
  async listarPorUsuario(usuario_id) {
    return db.prepare(`
      SELECT * FROM tbl_pedidos
      WHERE usuario_id = ? AND excluido_em IS NULL
    `).all(usuario_id);
  }

  async atualizar(pedido) {
    return db.prepare(`
      UPDATE tbl_pedidos SET
        status_pedido_id = ?,
        atualizado_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0
      WHERE uuid = ?
    `).run(
      pedido.status_pedido_id,
      pedido.uuid
    ).changes;
  }

  async remover(uuid) {
    return db.prepare(`
      UPDATE tbl_pedidos SET
        excluido_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }

  async marcarComoSincronizado(uuid) {
    return db.prepare(`
      UPDATE tbl_pedidos SET sincronizado_em = 1
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }
}

export default Pedidos;
