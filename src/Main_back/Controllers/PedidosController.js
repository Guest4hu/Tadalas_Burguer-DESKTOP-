import Pedidos from '../Models/Pedidos.js';

class PedidoController {

    constructor() {
        this.model = new Pedidos();
    }

    async listar() {
        return await this.model.listar();
    }

    async cadastrarLocalmente(pedido) {
        for (const element of pedido.dados) {
            if (await this.model.buscarPorID(element.pedido_id) === true) {
                console.log(`Pedido com ID ${element.pedido_id} já existe. Atualizando...`);
                await this.model.atualizar(element);
               continue;
            }
            console.log(`Cadastrando pedido com ID ${element.pedido_id}...`);
            await this.model.adicionar(element);
        }
    }

    async atualizar(pedido) {
        if (!pedido.uuid) return false;

        const existente = await this.model.buscarPorUUID(pedido.uuid);
        if (!existente) return false;

        return await this.model.atualizar(pedido);
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

export default PedidoController;
