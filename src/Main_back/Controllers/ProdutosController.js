import Produtos from '../Models/Produtos'

class ProdutosController {
    constructor() {
        this.produtoModel = new Produtos()
    }
    listar(){
        return this.produtoModel.listar()
    }
}

export default ProdutosController