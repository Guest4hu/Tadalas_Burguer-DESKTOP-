import Produtos from '../Models/Produtos.js';

class ProdutoController {

    constructor() {
        this.model = new Produtos();
    }

    async listar() {
        return await this.model.listar();
    }

    async cadastrarLocalmente(produto) {
        if (!produto.nome || !produto.preco || !produto.categoria_id)
            return false;

        return await this.model.adicionar(produto);
    }

    async atualizar(produto) {
        if (!produto.uuid) return false;

        const existente = await this.model.buscarPorUUID(produto.uuid);
        if (!existente) return false;

        return await this.model.atualizar(produto);
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

export default ProdutoController;
