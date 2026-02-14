import db from '../Database/db.js';
import crypto from 'node:crypto';

class Enderecos {

   async adicionar(endereco) {
    const uuid = crypto.randomUUID();

    return db.prepare(`
      INSERT OR IGNORE INTO tbl_enderecos
      (endereco_id, uuid, usuario_id, rua, numero, bairro, cidade, estado, cep, sincronizado_em,excluido_em)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `).run(
      endereco.endereco_id,
      uuid,
      endereco.usuario_id,
      endereco.rua,
      endereco.numero,
      endereco.bairro,
      endereco.cidade,
      endereco.estado,
      endereco.cep,
      endereco.excluido_em || null
    ).lastInsertRowid;
  }

  async listar() {
    return db.prepare(`
      SELECT * FROM tbl_enderecos WHERE excluido_em IS NULL
    `).all();
  }

  async listarPendentes() {
    return db.prepare(`
      SELECT * FROM tbl_enderecos 
      WHERE sincronizado_em = 0 AND excluido_em IS NULL
    `).all();
  }

  async listarSincronizados() {
    return db.prepare(`
      SELECT * FROM tbl_enderecos 
      WHERE sincronizado_em = 1 AND excluido_em IS NULL
    `).all();
  }

  async buscarPorID(endereco_id) {
    let stmt = db.prepare(`
      SELECT endereco_id FROM tbl_enderecos 
      WHERE endereco_id = ? AND excluido_em IS NULL
    `).get(endereco_id);
    stmt ??= { endereco_id: 0 };
    if (stmt.endereco_id > 0) {
      return true;
    } else {
      return false;
    }
  }

  async listarPorUsuario(usuario_id) {
    return db.prepare(`
      SELECT * FROM tbl_enderecos
      WHERE usuario_id = ? AND excluido_em IS NULL
    `).all(usuario_id);
  }

  async atualizar(endereco) {
    return db.prepare(`
      UPDATE tbl_enderecos SET
        rua = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, cep = ?,
        atualizado_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0,
        excluido_em = ?
      WHERE endereco_id = ?
    `).run(
      endereco.rua,
      endereco.numero,
      endereco.bairro,
      endereco.cidade,
      endereco.estado,
      endereco.cep,
      endereco.excluido_em || null,
      endereco.endereco_id
    ).changes;
  }

  async remover(uuid) {
    return db.prepare(`
      UPDATE tbl_enderecos SET
        excluido_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }

  async marcarComoSincronizado(uuid) {
    return db.prepare(`
      UPDATE tbl_enderecos SET sincronizado_em = 1
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }
}

export default Enderecos;
