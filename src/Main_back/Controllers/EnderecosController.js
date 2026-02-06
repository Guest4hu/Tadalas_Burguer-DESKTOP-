import Enderecos from '../Models/Enderecos.js';

class EnderecoController {

    constructor() {
        this.model = new Enderecos();
    }

    async listar() {
        return await this.model.listar();
    }

    async cadastrarLocalmente(endereco) {

        if (!endereco.usuario_id || !endereco.rua || !endereco.numero)
            return false;

        return await this.model.adicionar(endereco);
    }

    async atualizar(endereco) {
        if (!endereco.uuid) return false;

        const existente = await this.model.buscarPorUUID(endereco.uuid);
        if (!existente) return false;

        return await this.model.atualizar(endereco);
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

export default EnderecoController;
