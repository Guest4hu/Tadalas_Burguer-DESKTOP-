import Usuarios from "../Models/Usuarios"

class LoginController{
    constructor() {
        this.usuarioModel = new Usuarios()
    }
    async enviarCodigoRecuperacao(email){
        let usuarioEmail = await this.usuarioModel.buscarPorEmail(email);
        if(!usuarioEmail){
            return false
        }
    }





}
export default LoginController