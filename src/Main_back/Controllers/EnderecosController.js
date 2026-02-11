import Enderecos from '../Models/Enderecos.js';

class EnderecoController {

    constructor() {
        this.model = new Enderecos();
    }

    async listar() {
        return await this.model.listar();
    }

    async cadastrarLocalmente(endereco) {

        for (const element of endereco.dados) {
            if (await this.model.buscarPorID(element.endereco_id) === true) {
                console.log(`Endereço com ID ${element.endereco_id} já existe. Atualizando...`);
                await this.model.atualizar(element);
               continue;
                }
            console.log(`Cadastrando endereço com ID ${element.endereco_id}...`);
            await this.model.adicionar(element);
            }
        }


    async atualizar(endereco) {
        if (!endereco.id_endereco) return false;

        const existente = await this.model.buscarPorID(endereco.id_endereco);
        if (!existente) return false;

        return await this.model.atualizar(endereco);
    }

    async buscarPorID(id) {
        return await this.model.buscarPorID(id);
    }

    async remover(id) {
        const existente = await this.model.buscarPorID(id);
        if (!existente) return false;

        return await this.model.remover(existente);
    }
}

export default EnderecoController;
