import db from '../Database/db.js';

class Dominio {

    constructor() {

        this.tabelas = {
            tipoUsuario: {
                tabela: 'dom_tipo_usuario',
                coluna: 'descricao'
            },
            tipoPedido: {
                tabela: 'dom_tipo_pedido',
                coluna: 'descricao_tipo'
            },
            statusPagamento: {
                tabela: 'dom_status_pagamento',
                coluna: 'descricao'
            },
            metodoPagamento: {
                tabela: 'dom_metodo_pagamento',
                coluna: 'descricao_metodo'
            }
        };

    }

    // 📌 Validar domínio
    getConfig(tipo) {
        return this.tabelas[tipo];
    }

    // =============================
    // LISTAR
    // =============================

    listar(tipo) {
        const config = this.getConfig(tipo);
        if (!config) return [];

        const stmt = db.prepare(`
            SELECT * FROM ${config.tabela}
            ORDER BY id
        `);

        return stmt.all();
    }

    // =============================
    // BUSCAR POR ID
    // =============================

    buscarPorId(tipo, id) {
        const config = this.getConfig(tipo);
        if (!config) return null;

        const stmt = db.prepare(`
            SELECT * FROM ${config.tabela}
            WHERE id = ?
        `);

        return stmt.get(id);
    }

    // =============================
    // ADICIONAR
    // =============================

    adicionar(tipo, descricao) {
        const config = this.getConfig(tipo);
        if (!config) return false;

        const stmt = db.prepare(`
            INSERT INTO ${config.tabela} (${config.coluna})
            VALUES (?)
        `);

        const info = stmt.run(descricao);
        return info.lastInsertRowid;
    }

    // =============================
    // ATUALIZAR
    // =============================

    atualizar(tipo, id, descricao) {
        const config = this.getConfig(tipo);
        if (!config) return false;

        const stmt = db.prepare(`
            UPDATE ${config.tabela}
            SET ${config.coluna} = ?
            WHERE id = ?
        `);

        const info = stmt.run(descricao, id);
        return info.changes > 0;
    }

    // =============================
    // REMOVER
    // =============================

    remover(tipo, id) {
        const config = this.getConfig(tipo);
        if (!config) return false;

        const stmt = db.prepare(`
            DELETE FROM ${config.tabela}
            WHERE id = ?
        `);

        const info = stmt.run(id);
        return info.changes > 0;
    }

}

export default Dominio;
