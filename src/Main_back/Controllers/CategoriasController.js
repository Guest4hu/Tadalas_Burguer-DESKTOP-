import Categorias from '../Models/Categorias.js';

class CategoriaController {

    constructor() {
        this.model = new Categorias();
    }

    async listar() {
        return await this.model.listar();
    }

    async cadastrarLocalmente(categoria) {
        if (!categoria.nome) return false;
        return await this.model.adicionar(categoria);
    }

    async atualizar(categoria) {
        if (!categoria.uuid) return false;

        const existente = await this.model.buscarPorUUID(categoria.uuid);
        if (!existente) return false;

        return await this.model.atualizar(categoria);
    }

    async buscarPorUUID(uuid) {
        return await this.model.buscarPorUUID(uuid);
    }

    async remover(uuid) {
        const existente = await this.model.buscarPorUUID(uuid);
        if (!existente) return false;

        return await this.model.remover(existente);
    }
}

export default CategoriaController;
