import Usuarios from '../Models/Usuarios.js'


class UsuariosController {
    constructor() {
        this.usuarioModel = new Usuarios()
    }
    listarTodosUsuarios(){
        return this.usuarioModel.listarTodosUsuarios()
    }
}