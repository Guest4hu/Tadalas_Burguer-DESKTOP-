import db from '../Database/db.js';
import crypto from 'node:crypto';

class Categorias {

  adicionar(categoria) {
    const uuid = crypto.randomUUID();

    return db.prepare(`
      INSERT INTO tbl_categoria
      (uuid, nome, descricao, sincronizado_em)
      VALUES (?, ?, ?, 0)
    `).run(
      uuid,
      categoria.nome,
      categoria.descricao
    ).lastInsertRowid;
  }

  listar() {
    return db.prepare(`
      SELECT * FROM tbl_categoria WHERE excluido_em IS NULL
    `).all();
  }

  listarPendentes() {
    return db.prepare(`
      SELECT * FROM tbl_categoria 
      WHERE sincronizado_em = 0 AND excluido_em IS NULL
    `).all();
  }

  listarSincronizados() {
    return db.prepare(`
      SELECT * FROM tbl_categoria 
      WHERE sincronizado_em = 1 AND excluido_em IS NULL
    `).all();
  }

  buscarPorUUID(uuid) {
    return db.prepare(`
      SELECT * FROM tbl_categoria 
      WHERE uuid = ? AND excluido_em IS NULL
    `).get(uuid);
  }

  atualizar(categoria) {
    return db.prepare(`
      UPDATE tbl_categoria SET
        nome = ?, descricao = ?,
        atualizado_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0
      WHERE uuid = ?
    `).run(
      categoria.nome,
      categoria.descricao,
      categoria.uuid
    ).changes;
  }

  remover(uuid) {
    return db.prepare(`
      UPDATE tbl_categoria SET
        excluido_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }

  marcarComoSincronizado(uuid) {
    return db.prepare(`
      UPDATE tbl_categoria SET sincronizado_em = 1
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }
}

export default Categorias;
