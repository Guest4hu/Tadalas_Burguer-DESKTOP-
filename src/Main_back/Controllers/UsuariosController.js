import Usuarios from '../Models/Usuarios.js';

class UsuarioController {

    constructor() {
        this.model = new Usuarios();
    }

    async listar() {
        return await this.model.listarClientes();
    }

    async cadastrarLocalmente(usuario) {
        // Validação de segurança
        if (!usuario || !usuario.sucess || !usuario.dados?.dados) {
            console.warn('[Usuarios] Dados inválidos:', usuario?.message || 'sem resposta');
            return;
        }

        const itens = usuario.dados.dados;
        if (!Array.isArray(itens) || itens.length === 0) {
            console.warn('[Usuarios] Nenhum usuário para cadastrar');
            return;
        }

        for (const element of itens) {
            if (await this.model.buscarPorID(element.usuario_id) === true) {
                console.log(`Usuário com ID ${element.usuario_id} já existe. Atualizando...`);
                await this.model.atualizar(element);
               continue;
            }
            console.log(`Cadastrando usuário com ID ${element.usuario_id}...`);
            await this.model.adicionar(element);
        }
    }

   

    async atualizar(usuario) {
        if (!usuario.uuid) return false;

        const existente = await this.model.buscarPorUUID(usuario.uuid);
        if (!existente) return false;

        return await this.model.atualizar(usuario);
    }

    async buscarPorUUID(uuid) {
        if (!uuid) return false;
        return await this.model.buscarPorUUID(uuid);
    }

    async remover(uuid) {
        const existente = await this.model.buscarPorUUID(uuid);
        if (!existente) return false;

        return await this.model.remover(existente);
    }
}

export default UsuarioController;
