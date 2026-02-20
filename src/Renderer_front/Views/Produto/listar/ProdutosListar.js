import ProdutosView from "../ProdutosView.js";

class ProdutosListar{
    constructor(){
        this.view = new ProdutosView()
    }

    async renderizarLista(){
        const dados = await window.api.listar()
        console.log('dados no produto lista', dados)
        return this.view.renderizarLista(dados)
    }
}

export default ProdutosListar