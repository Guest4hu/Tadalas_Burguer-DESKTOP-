import ProdutosView from "../Views/Produto/ProdutosView";
import ProdutosListar from "../Views/Produto/listar/ProdutosListar"

class Rotas {
    constructor(){
        this.rotas = {
            '/produto_menu': () => {
                return new ProdutosView().renderizarMenu()
            },
            '/produto_listar': async () => {
                return new ProdutosListar().renderizarLista()
            }
        }
    }

    async getPage(rota){
        return await this.rotas[rota]()
    }
}

export default Rotas