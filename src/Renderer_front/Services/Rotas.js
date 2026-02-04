import ProdutosView from "../Views/Produto/ProdutosView";
import ProdutosListar from "../Views/Produto/listar/ProdutosListar"
import Login from "../Views/Login.js";

class Rotas {
    constructor(){
        this.rotas = {
            "/renderizar_login": () => {
                return new Login().renderizarLogin()
            },
            "/registrarConta": () => {
                return new Login().modalRegistrarConta()
            }
        }
    }

    async getPage(rota){
        return await this.rotas[rota]()
    }
}

export default Rotas