import Produtos from '../Models/Produtos.js';

class ProdutoController {

    constructor() {
        this.model = new Produtos();
    }

    async listar() {
        return await this.model.listar();
    }

    async cadastrarLocalmente(produto) {
        for (const element of produto.dados) {
            if (await this.model.buscarPorID(element.produto_id) === true) {
                console.log(`Produto com ID do produto: ${element.produto_id} já existe. Atualizando...`);
                await this.model.atualizar(element);
               continue;
            }
            console.log(`Cadastrando produto com ID do produto: ${element.produto_id}...`);
            await this.model.adicionar(element);
        }
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
