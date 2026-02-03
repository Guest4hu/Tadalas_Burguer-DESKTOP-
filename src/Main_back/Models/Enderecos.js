import db from '../Database/db.js';
import crypto from 'node:crypto';

class Enderecos {

  adicionar(endereco) {
    const uuid = crypto.randomUUID();

    return db.prepare(`
      INSERT INTO tbl_enderecos
      (uuid, usuario_id, rua, numero, bairro, cidade, estado, cep, sincronizado_em)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      uuid,
      endereco.usuario_id,
      endereco.rua,
      endereco.numero,
      endereco.bairro,
      endereco.cidade,
      endereco.estado,
      endereco.cep
    ).lastInsertRowid;
  }

  listar() {
    return db.prepare(`
      SELECT * FROM tbl_enderecos WHERE excluido_em IS NULL
    `).all();
  }

  listarPendentes() {
    return db.prepare(`
      SELECT * FROM tbl_enderecos 
      WHERE sincronizado_em = 0 AND excluido_em IS NULL
    `).all();
  }

  listarSincronizados() {
    return db.prepare(`
      SELECT * FROM tbl_enderecos 
      WHERE sincronizado_em = 1 AND excluido_em IS NULL
    `).all();
  }

  buscarPorUUID(uuid) {
    return db.prepare(`
      SELECT * FROM tbl_enderecos 
      WHERE uuid = ? AND excluido_em IS NULL
    `).get(uuid);
  }

  listarPorUsuario(usuario_id) {
    return db.prepare(`
      SELECT * FROM tbl_enderecos
      WHERE usuario_id = ? AND excluido_em IS NULL
    `).all(usuario_id);
  }

  atualizar(endereco) {
    return db.prepare(`
      UPDATE tbl_enderecos SET
        rua = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, cep = ?,
        atualizado_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0
      WHERE uuid = ?
    `).run(
      endereco.rua,
      endereco.numero,
      endereco.bairro,
      endereco.cidade,
      endereco.estado,
      endereco.cep,
      endereco.uuid
    ).changes;
  }

  remover(uuid) {
    return db.prepare(`
      UPDATE tbl_enderecos SET
        excluido_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }

  marcarComoSincronizado(uuid) {
    return db.prepare(`
      UPDATE tbl_enderecos SET sincronizado_em = 1
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }
}

export default Enderecos;
