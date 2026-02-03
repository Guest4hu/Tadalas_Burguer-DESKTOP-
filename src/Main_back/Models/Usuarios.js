import db from '../Database/db.js';
import crypto from 'node:crypto';

class Usuarios {

  adicionar(usuario) {
    const uuid = crypto.randomUUID();

    return db.prepare(`
      INSERT INTO tbl_usuarios
      (uuid, nome, email, senha, telefone, tipo_usuario_id, sincronizado_em)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `).run(
      uuid,
      usuario.nome,
      usuario.email,
      usuario.senha,
      usuario.telefone || null,
      usuario.tipo_usuario_id
    ).lastInsertRowid;
  }

  listar() {
    return db.prepare(`
      SELECT * FROM tbl_usuarios WHERE excluido_em IS NULL
    `).all();
  }

  listarPendentes() {
    return db.prepare(`
      SELECT * FROM tbl_usuarios 
      WHERE sincronizado_em = 0 AND excluido_em IS NULL
    `).all();
  }

  listarSincronizados() {
    return db.prepare(`
      SELECT * FROM tbl_usuarios 
      WHERE sincronizado_em = 1 AND excluido_em IS NULL
    `).all();
  }

  buscarPorUUID(uuid) {
    return db.prepare(`
      SELECT * FROM tbl_usuarios 
      WHERE uuid = ? AND excluido_em IS NULL
    `).get(uuid);
  }

  atualizar(usuario) {
    return db.prepare(`
      UPDATE tbl_usuarios SET
        nome = ?,
        email = ?,
        telefone = ?,
        atualizado_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0
      WHERE uuid = ?
    `).run(
      usuario.nome,
      usuario.email,
      usuario.telefone,
      usuario.uuid
    ).changes;
  }

  remover(uuid) {
    return db.prepare(`
      UPDATE tbl_usuarios SET
        excluido_em = CURRENT_TIMESTAMP,
        sincronizado_em = 0
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }

  marcarComoSincronizado(uuid) {
    return db.prepare(`
      UPDATE tbl_usuarios SET
        sincronizado_em = 1,
        atualizado_em = CURRENT_TIMESTAMP
      WHERE uuid = ?
    `).run(uuid).changes > 0;
  }
}

export default Usuarios;
