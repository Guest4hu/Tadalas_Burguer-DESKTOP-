import db from '../Database/db.js';
import crypto from 'node:crypto';

class ItensPedido {

  adicionar(item) {
    const uuid = crypto.randomUUID();

    return db.prepare(`
      INSERT INTO tbl_itens_pedidos
      (uuid, pedido_id, produto_id, quantidade, valor_unitario, sincronizado_em)
      VALUES (?, ?, ?, ?, ?, 0)
    `).run(
      uuid,
      item.pedido_id,
      item.produto_id,
      item.quantidade,
      item.valor_unitario
    ).lastInsertRowid;
  }

  listar() {
    return db.prepare(`
      SELECT * FROM tbl_itens_pedidos WHERE excluido_em IS NULL
    `).all();
  }

  listarPendentes() {
    return db.prepare(`
      SELECT * FROM tbl_itens_pedidos 
      WHERE sincronizado_em = 0 AND excluido_em IS NULL
    `).all();
  }

  listarPorPedido(pedido_id) {
    return db.prepare(`
      SELECT * FROM tbl_itens_pedidos
      WHERE pedido_id = ? AND excluido_em IS NULL
    `).all(pedido_id);
  }

  buscarPorUUID(uuid) {
    return db.prepare(`
      SELECT * FROM tbl_itens_pedidos 
      WHERE uuid = ? AND excluido_em IS NULL
    `).get(uuid);
  }

  remover(uuid) {
    return db.prepare(`
      UPDATE tbl_itens_pedidos SET
        excluido_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }

  marcarComoSincronizado(uuid) {
    return db.prepare(`
      UPDATE tbl_itens_pedidos SET sincronizado_em = 1
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }
}

export default ItensPedido;
