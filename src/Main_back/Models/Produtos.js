import db from '../Database/db'

class Produtos {
    constructor() {
    }

    listar() {
        const stmt = db.prepare('SELECT * FROM produtos')
        return stmt.all()
    }
}

export default Produtos