import Login from "../Views/Login/Login.js";
import PDV from "../Views/PDV/PDV.js";
import EsqueciSenha from "../Views/Login/Botoes/EsqueciSenha.js";

class Rotas {
    constructor(){
        this.rotas = {
            "/Login": () => {
                return new Login()
            },
            "/PDV": () => {
                return new PDV()
            },
            "/EsqueciSenha": () => {
                return new EsqueciSenha()
            }
        }
    }

    async getPage(rota){
        return await this.rotas[rota]()
    }
}

export default Rotas