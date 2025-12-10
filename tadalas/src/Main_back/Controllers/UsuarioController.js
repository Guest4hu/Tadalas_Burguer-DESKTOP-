import Usuarios from '../Models/Usuarios.js';
class UsuarioController{
    constructor(){
        this.usuarioModel = new Usuarios();
    }
    async listar(){
        const dados = await this.usuarioModel.listar();
        console.log('dados no controller', dados);
        return dados
    }
    async sincronizarAPIlocal(usuarios){

        usuarios.forEach(usuario => {
        if(this.usuarioModel.buscarPorEmail(usuarios.email_usuario)){
            if(!this.usuarioModel.adicionar(usuario)){
                console.log(`usuario: ${usuarios.email_usuario}`)
            }
        }
    });
} 
    

    async cadastrar(usuario){
        if(!usuario.nome || !usuario.idade){
            return false;
        }
        this.usuarioModel.adicionar(usuario);
        return true;
    }
    async atualizarUsuario(usuario){
        if(!usuario.nome || !usuario.idade){
            return false;
        }
        const usuarioExistente = await this.usuarioModel.buscarPorId(usuario.uuid);
        if(!usuarioExistente){
            return false;
        }
        const resultado = this.usuarioModel.atualizar(usuario);
        return resultado;
    }

    async buscarUsuarioPorId(uuid){
        if(!uuid){
            return false
        }
       return this.usuarioModel.buscarPorId(uuid)
    }
    async removerUsuario(uuid){
        const usuarioExistente = await this.usuarioModel.buscarPorId(uuid);
        if(!usuarioExistente){
            return false;
        }
        const resultado = await this.usuarioModel.remover(usuarioExistente);
        console.log('resultado remoção', resultado);
    }

}
export default UsuarioController;