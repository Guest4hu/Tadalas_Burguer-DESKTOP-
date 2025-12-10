import db from "../Database/db";
class Usuarios {
    constructor(){

    }
    adicionar(usuario){
        const uuid = cripto.randomUUID();
        const sincronizacao = usuario.sync_status || 0;
        const stmt = db.prepare(`INSERT INTO usuarios (uuid, nome_usuario, email_usuario, tipo_usuario, sync_status) VALUES (?, ?, ?, ?, ?)`);
        const info =  stmt.run(
            usuario.uuid,
            usuario.nome_usuario,
            usuario.email_usuario,
            usuario.tipo_usuario,
          sincronizacao
        );
    }
    async listar(){
        const stmt = db.prepare("SELECT * FROM Usuarios WHERE excluido_em IS NULL");
        return stmt.all();
    }
    async bucarPorId(uuid){
        const stmt = db.prepare("SELECT * FROM Usuarios WHERE uuid = ? AND excluido_em IS NULL");
        return stmt.get(uuid);
    }
    async atualizar(usuarioAtualizado){
        const stmt = db.prepare(`UPDATE usuarios SET nome_usuario = ?, email_usuario = ?, tipo_usuario = ?, atualizado_em = CURRENT_TIMESTAMP, sync_status = ? WHERE uuid = ?`);
        const info = stmt.run(
            usuarioAtualizado.nome_usuario,
            usuarioAtualizado.email_usuario,
            usuarioAtualizado.tipo_usuario,
            usuarioAtualizado.sync_status,
            usuarioAtualizado.uuid
        );
    }
}
export default Usuarios;