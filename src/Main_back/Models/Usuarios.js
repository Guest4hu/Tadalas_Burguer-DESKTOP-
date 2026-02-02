import db from '../Database/db'


class Usuarios
{
    constructor() {
    }

    listarTodosUsuarios() {
        const stmt = db.prepare('SELECT * FROM tbl_usuarios')
        return stmt.all()
    }
}