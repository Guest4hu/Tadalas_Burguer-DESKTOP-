import Pedidos from '../Models/Pedidos.js';

class PedidoController {

    constructor() {
        this.model = new Pedidos();
    }

    async listar() {
        return await this.model.listar();
    }

    async cadastrarLocalmente(pedido) {
        if (!pedido.usuario_id || !pedido.status_pedido_id || !pedido.tipo_pedido)
            return false;

        return await this.model.adicionar(pedido);
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
