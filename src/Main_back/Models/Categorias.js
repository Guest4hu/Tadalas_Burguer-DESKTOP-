import db from '../Database/db.js';
import crypto from 'node:crypto';

class Categorias {

  async adicionar(categoria) {
    const uuid = crypto.randomUUID();

    console.log("Dados Categoria, chegou:", categoria);

    return db.prepare(`
      INSERT OR IGNORE INTO tbl_categoria
      (uuid, nome, descricao, sincronizado_em,id_categoria)
      VALUES (?, ?, ?, 0, ?)
    `).run(
      uuid,
      categoria.nome,
      categoria.descricao,
      categoria.id_categoria
    ).lastInsertRowid;
  }

  async listar() {
    return db.prepare(`
      SELECT * FROM tbl_categoria WHERE excluido_em IS NULL
    `).all();
  }

  async listarPendentes() {
   return db.prepare(`
      SELECT * FROM tbl_categoria 
      WHERE sincronizado_em = 0 AND excluido_em IS NULL
    `).all();
  }

  async listarSincronizados() {
    return db.prepare(`
      SELECT * FROM tbl_categoria 
      WHERE sincronizado_em = 1 AND excluido_em IS NULL
    `).all();
  }

  async buscarPorID(id_categoria) {
    let result = db.prepare(`
      SELECT id_categoria FROM tbl_categoria 
      WHERE id_categoria = ? AND excluido_em IS NULL
    `).get(id_categoria);
    result ??= { id_categoria: 0 };
    if (result.id_categoria > 0) {
      return true;
    } else {
      return false;
    }
  }

  async atualizar(categoria) {
    return db.prepare(`
      UPDATE tbl_categoria SET
        nome = ?, descricao = ?,
        atualizado_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0
      WHERE id_categoria = ?
    `).run(
      categoria.nome,
      categoria.descricao,
      categoria.uuid
    ).changes;
  }

  async remover(uuid) {
    return db.prepare(`
      UPDATE tbl_categoria SET
        excluido_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }

  async marcarComoSincronizado(uuid) {
    return db.prepare(`
      UPDATE tbl_categoria SET sincronizado_em = 1
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }
}

export default Categorias;
