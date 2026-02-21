import Enderecos from '../Models/Enderecos.js';
import APIFetch from '../Services/APIFetch.js';

class EnderecoController {

    constructor() {
        this.model = new Enderecos();
        this.fetch = APIFetch;
    }

    async searchCEP(cep){
        return this.fetch.fetchData(`https://viacep.com.br/ws/${cep}/json/`, 'GET');
    }

    async listar() {
        return await this.model.listar();
    }

    async cadastrarLocalmente(endereco) {
        // Validação de segurança
        if (!endereco || !endereco.sucess || !endereco.dados?.dados) {
            console.warn('[Enderecos] Dados inválidos:', endereco?.message || 'sem resposta');
            return;
        }

        const itens = endereco.dados.dados;
        if (!Array.isArray(itens) || itens.length === 0) {
            console.warn('[Enderecos] Nenhum endereço para cadastrar');
            return;
        }

        for (const element of itens) {
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
