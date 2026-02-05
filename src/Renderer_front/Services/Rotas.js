import ProdutosView from "../Views/Produto/ProdutosView";
import ProdutosListar from "../Views/Produto/listar/ProdutosListar"
import Login from "../Views/Login.js";
import PDV from "../Views/PDV/PDV.js";

class Rotas {
    constructor(){
        this.rotas = {
            "/Login": () => {
                return new Login()
            },
            "/PDV": () => {
                return new PDV()
            }
        }
    }

    async getPage(rota){
        return await this.rotas[rota]()
    }
}

export default Rotas