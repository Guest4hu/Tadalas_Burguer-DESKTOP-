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

    async cadastrarLocalmente(tipo, descricao) {
        if (!tipo || !descricao) return false;
        return this.model.adicionar(tipo, descricao);
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
