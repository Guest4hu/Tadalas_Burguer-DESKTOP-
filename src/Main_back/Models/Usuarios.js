import db from '../Database/db'


class Usuarios
{
    constructor() {
    }

    listarTodosUsuarios() {
        const stmt = db.prepare('SELECT * FROM usuarios')
        return stmt.all()
    }
}