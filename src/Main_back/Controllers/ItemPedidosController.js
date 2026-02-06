import ItensPedidos from '../Models/ItensPedidos.js';

class ItemPedidoController {

    constructor() {
        this.model = new ItensPedidos();
    }

    async listar() {
        return await this.model.listar();
    }

    async cadastrarLocalmente(item) {

        if (!item.pedido_id || !item.produto_id || !item.valor_unitario)
            return false;

        return await this.model.adicionar(item);
    }

    async atualizar(item) {
        if (!item.uuid) return false;

        const existente = await this.model.buscarPorUUID(item.uuid);
        if (!existente) return false;

        return await this.model.atualizar(item);
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

export default ItemPedidoController;
