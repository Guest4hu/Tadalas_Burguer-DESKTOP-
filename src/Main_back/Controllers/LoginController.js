import Usuarios from "../Models/Usuarios"
import bcrypt from "bcryptjs";
import APIFetch from "../Services/APIFetch.js";
import { net } from "electron";

class LoginController{
    constructor() {
        this.usuarioModel = new Usuarios()
        this.api = APIFetch;
        this.employeeData = [];
    }
    async enviarCodigoRecuperacao(email){
        let usuarioEmail = await this.usuarioModel.buscarPorEmail(email);
        if(!usuarioEmail){
            return false
        }
    }
    async getLoggedEmployeeData() {
        return this.employeeData;
    }
    async validarCredenciais(email, senha) {
        const usuario = await this.usuarioModel.buscarPorEmail(email);
        if (!usuario) {
            return { success: false, message: 'Usuário não encontrado.' };
        }
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        console.log(senhaValida, "Resultado da comparação de senha");
        if (!senhaValida) {
            return { success: false, message: 'Senha incorreta.' };
        }
        return { success: true, message: 'Login realizado com sucesso.', usuario: usuario };    
    }
}
export default LoginController