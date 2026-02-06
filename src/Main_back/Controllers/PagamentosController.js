import Pagamentos from '../Models/Pagamentos.js';

class PagamentoController {

    constructor() {
        this.model = new Pagamentos();
    }

    async listar() {
        return await this.model.listar();
    }

    async cadastrarLocalmente(pagamento) {

        if (!pagamento.pedido_id || !pagamento.metodo || !pagamento.valor_total)
            return false;

        return await this.model.adicionar(pagamento);
    }

    async atualizar(pagamento) {
        if (!pagamento.uuid) return false;

        const existente = await this.model.buscarPorUUID(pagamento.uuid);
        if (!existente) return false;

        return await this.model.atualizar(pagamento);
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

export default PagamentoController;
