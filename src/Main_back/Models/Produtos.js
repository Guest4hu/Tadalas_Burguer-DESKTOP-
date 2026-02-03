import db from '../Database/db.js';
import crypto from 'node:crypto';

class Produtos {

  adicionar(produto) {
    const uuid = crypto.randomUUID();

    return db.prepare(`
      INSERT INTO tbl_produtos
      (uuid, nome, descricao, preco, estoque, categoria_id, foto_produto, sincronizado_em)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      uuid,
      produto.nome,
      produto.descricao,
      produto.preco,
      produto.estoque,
      produto.categoria_id,
      produto.foto_produto
    ).lastInsertRowid;
  }

  listar() {
    return db.prepare(`
      SELECT * FROM tbl_produtos WHERE excluido_em IS NULL
    `).all();
  }

  listarPendentes() {
    return db.prepare(`
      SELECT * FROM tbl_produtos 
      WHERE sincronizado_em = 0 AND excluido_em IS NULL
    `).all();
  }

  listarSincronizados() {
    return db.prepare(`
      SELECT * FROM tbl_produtos 
      WHERE sincronizado_em = 1 AND excluido_em IS NULL
    `).all();
  }

  buscarPorUUID(uuid) {
    return db.prepare(`
      SELECT * FROM tbl_produtos 
      WHERE uuid = ? AND excluido_em IS NULL
    `).get(uuid);
  }

  listarPorCategoria(categoria_id) {
    return db.prepare(`
      SELECT * FROM tbl_produtos
      WHERE categoria_id = ? AND excluido_em IS NULL
    `).all(categoria_id);
  }

  atualizar(produto) {
    return db.prepare(`
      UPDATE tbl_produtos SET
        nome = ?, descricao = ?, preco = ?, estoque = ?, categoria_id = ?,
        atualizado_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0
      WHERE uuid = ?
    `).run(
      produto.nome,
      produto.descricao,
      produto.preco,
      produto.estoque,
      produto.categoria_id,
      produto.uuid
    ).changes;
  }

  remover(uuid) {
    return db.prepare(`
      UPDATE tbl_produtos SET
        excluido_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }

  marcarComoSincronizado(uuid) {
    return db.prepare(`
      UPDATE tbl_produtos SET sincronizado_em = 1
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }
}

export default Produtos;
