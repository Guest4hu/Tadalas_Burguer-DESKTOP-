async function puxar(nome, dados) {
    const modulo = await import(`./Main_back/Controllers/${nome}.js`)
    const Classe = modulo.default || modulo[nome]  
    return new Classe(dados)
}

class Importacao {
    dados = []
    Produtos

    constructor() {
        this.init()
    }

    async init() {
        this.Produtos = await puxar("ProdutosController", this.dados)
        
    }
}

export default Importacao
