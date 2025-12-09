import Usuarios from "../Models/Usuario";
class UsuarioController {
    constructor(){
        this.usuarioModel = new Usuarios();
    }
    async listar( ){
        const dados = await this.usuarioModel.listar();
        console.log('dados no console', dados);
        return dados;
    }
}