import Usuarios from '../Models/Usuarios.js'


export default class UsuariosController {
    constructor() {
        this.usuarioModel = new Usuarios()
    }
    listarTodosUsuarios(){
        return this.usuarioModel.listarTodosUsuarios()
    }
}