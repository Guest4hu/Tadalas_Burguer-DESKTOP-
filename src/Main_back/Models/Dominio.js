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
            },
            statusPedido: {
                tabela: 'dom_status_pedido',
                coluna: 'descricao'
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

    async listar(tipo) {
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

    async buscarPorId(tipo, id) {
        const config = this.getConfig(tipo);
        if (!config) return null;

        let stmt = db.prepare(`
            SELECT id FROM ${config.tabela}
            WHERE id = ?
        `).get(id);
        stmt ??= {id: 0};
        if (stmt.id > 0) {
      return true;
    } else {
      return false;
    }
    }

    // =============================
    // ADICIONAR
    // =============================

    async adicionar(tipo, dados) {
        const config = this.getConfig(tipo);
        if (!config) return false;
        if (config.tabela === 'dom_tipo_pedido') {
            descricao = dados.descricao_tipo;
        }
            else if (config.tabela === 'dom_metodo_pagamento') {
                descricao = dados.descricao_metodo;
            }
            else {
                descricao = dados.descricao;
            }

        const stmt = db.prepare(`
            INSERT OR IGNORE INTO ${config.tabela} (${config.coluna})
            VALUES (?)
        `);

        const info = stmt.run(descricao);
        return info.lastInsertRowid;
    }

    // =============================
    // ATUALIZAR
    // =============================

    async atualizar(tipo, id, descricao) {
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

    async remover(tipo, id) {
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
