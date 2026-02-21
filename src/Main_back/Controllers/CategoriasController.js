import Categorias from '../Models/Categorias.js';

class CategoriaController {

    constructor() {
        this.model = new Categorias();
    }

    async listar() {
        return await this.model.listar();
    }

    async cadastrarLocalmente(categoria) {
        // Validação de segurança
        if (!categoria || !categoria.sucess || !categoria.dados?.dados) {
            console.warn('[Categorias] Dados inválidos:', categoria?.message || 'sem resposta');
            return;
        }

        const itens = categoria.dados.dados;
        if (!Array.isArray(itens) || itens.length === 0) {
            console.warn('[Categorias] Nenhuma categoria para cadastrar');
            return;
        }

        for (const element of itens) {
            if (await this.model.buscarPorID(element.id_categoria) === true) {
                console.log(`Categoria ${element.id_categoria} já existe. atualizando...`);
                await this.model.atualizar(element);
               continue;
            }
            console.log(`Cadastrando categoria ${element.id_categoria}...`);
             await this.model.adicionar(element);
        }        
    }

    async atualizar(categoria) {
        if (!categoria.uuid) return false;

        const existente = await this.model.buscarPorID(categoria.uuid);
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
