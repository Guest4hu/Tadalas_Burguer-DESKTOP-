import Dominio from '../Models/Dominio.js';

class DominioController {

    constructor() {
        this.model = new Dominio();
    }

    // =============================
    // LISTAR
    // =============================

    async listar(tipo) {
        if (!tipo) return [];
        return this.model.listar(tipo);
    }

    // =============================
    // BUSCAR
    // =============================

    async buscarPorId(tipo, id) {
        if (!tipo || !id) return false;
        return this.model.buscarPorId(tipo, id);
    }

    // =============================
    // CADASTRAR
    // =============================

    async cadastrarLocalmente(dados, tipo) {
        // Validação de segurança
        if (!dados || !dados.sucess || !dados.dados?.dados) {
            console.warn(`[Dominio] Dados inválidos para ${tipo}:`, dados?.message || 'sem resposta');
            return;
        }

        const itens = dados.dados.dados;
        if (!Array.isArray(itens) || itens.length === 0) {
            console.warn(`[Dominio] Nenhum item para cadastrar em ${tipo}`);
            return;
        }

        for (const element of itens) {
            if (await this.model.buscarPorId(tipo, element.id)) {
                console.log(`Domínio ${tipo} com ID ${element.id} já existe. atualizando...`);
                await this.model.atualizar(tipo, element.id, element.descricao);
               continue;
            }
            console.log("Element Antes de cadastrar:");
            console.log(element);
            await this.model.adicionar(tipo, element);
        }
    }

    // =============================
    // ATUALIZAR
    // =============================

    async atualizar(tipo, id, descricao) {

        if (!tipo || !id || !descricao)
            return false;

        const existe = this.model.buscarPorId(tipo, id);
        if (!existe) return false;

        return this.model.atualizar(tipo, id, descricao);
    }

    // =============================
    // REMOVER
    // =============================

    async remover(tipo, id) {

        if (!tipo || !id)
            return false;

        const existe = this.model.buscarPorId(tipo, id);
        if (!existe) return false;

        return this.model.remover(tipo, id);
    }

}

export default DominioController;
