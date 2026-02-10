import ItensPedidos from '../Models/ItensPedidos.js';

class ItemPedidoController {

    constructor() {
        this.model = new ItensPedidos();
    }

    async listar() {
        return await this.model.listar();
    }

    async cadastrarLocalmente(item) {
        for (const element of item.dados) {
            if (await this.model.buscarPorUUID(element.uuid) === true) {
                console.log(`Item de pedido com UUID ${element.uuid} já existe. Pulando...`);
               continue;
            }
            console.log(`Cadastrando item de pedido com UUID ${element.uuid}...`);
             await this.model.adicionar(element);
        }
      
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
