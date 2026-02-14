import db from '../Database/db.js';
import crypto from 'node:crypto';

class Produtos {

  async adicionar(produto) {
    const uuid = crypto.randomUUID();

    return db.prepare(`
      INSERT OR IGNORE INTO tbl_produtos
      (produto_id, uuid, nome, descricao, preco, estoque, categoria_id, foto_produto, sincronizado_em,excluido_em)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `).run(
      produto.produto_id,
      uuid,
      produto.nome,
      produto.descricao,
      produto.preco,
      produto.estoque,
      produto.categoria_id,
      produto.foto_produto,
      produto.excluido_em || null
    ).lastInsertRowid;
  }

  async listar() {
    return db.prepare(`
      SELECT * FROM tbl_produtos WHERE excluido_em IS NULL
    `).all();
  }

  async listarPendentes() {
    return db.prepare(`
      SELECT * FROM tbl_produtos 
      WHERE sincronizado_em = 0 AND excluido_em IS NULL
    `).all();
  }

  async listarSincronizados() {
    return db.prepare(`
      SELECT * FROM tbl_produtos 
      WHERE sincronizado_em = 1 AND excluido_em IS NULL
    `).all();
  }

  async buscarPorID(produto_id) {
    let stmt = db.prepare(`
      SELECT produto_id FROM tbl_produtos 
      WHERE produto_id = ? AND excluido_em IS NULL
    `).get(produto_id);
    stmt ??= { produto_id: 0 };
    if (stmt.produto_id > 0) {
      return true;
    } else {
      return false;
    }
  }
  async listarPorCategoria(categoria_id) {
    return db.prepare(`
      SELECT * FROM tbl_produtos
      WHERE categoria_id = ? AND excluido_em IS NULL
    `).all(categoria_id);
  }

  async atualizar(produto) {
    return db.prepare(`
      UPDATE tbl_produtos SET
        nome = ?, descricao = ?, preco = ?, estoque = ?, categoria_id = ?, foto_produto = ?,
        atualizado_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0, excluido_em = ?
      WHERE produto_id = ?
    `).run(
      produto.nome,
      produto.descricao,
      produto.preco,
      produto.estoque,
      produto.categoria_id,
      produto.foto_produto,
      produto.excluido_em || null,
      produto.produto_id
    ).changes;
  }

  async remover(uuid) {
    return db.prepare(`
      UPDATE tbl_produtos SET
        excluido_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }

  async marcarComoSincronizado(uuid) {
    return db.prepare(`
      UPDATE tbl_produtos SET sincronizado_em = 1
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }
}

export default Produtos;
