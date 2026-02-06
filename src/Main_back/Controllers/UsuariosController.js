import Usuarios from '../Models/Usuarios.js';

class UsuarioController {

    constructor() {
        this.model = new Usuarios();
    }

    async listar() {
        return await this.model.listar();
    }

    async cadastrarLocalmente(usuario) {
        if (!usuario.nome || !usuario.email || !usuario.tipo_usuario_id) return false;
        return await this.model.adicionar(usuario);
    }

    async cadastrarLocalmente(dados) {
        if (!dados?.dados?.data?.data) return false;

        const existentes = await this.model.listarSincronizados();

        for (const usuario of dados.dados.data.data) {

            const emailAtual = usuario.email?.trim().toLowerCase();
            if (!emailAtual) continue;

            const jaExiste = existentes.some(u =>
                u.email.trim().toLowerCase() === emailAtual
            );

            if (!jaExiste)
                await this.model.cadastrarLocalmente(usuario);
        }

        return true;
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
