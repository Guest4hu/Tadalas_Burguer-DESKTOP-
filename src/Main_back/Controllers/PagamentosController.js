import Pagamentos from '../Models/Pagamentos.js';

class PagamentoController {

    constructor() {
        this.model = new Pagamentos();
    }

    async listar() {
        return await this.model.listar();
    }

    async cadastrarLocalmente(pagamento) {
        for (const element of pagamento.dados) {
            
            if (await this.model.buscarPorID(element.pagamento_id) === true) {
                console.log(`Pagamento com UUID ${element.pagamento_id} já existe. Atualizando...`);
                await this.model.atualizar(element);
               continue;
            }
            console.log(`Cadastrando pagamento com UUID ${element.pagamento_id}...`);
             await this.model.adicionar(element);
        }
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
