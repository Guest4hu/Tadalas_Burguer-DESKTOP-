class index{
    constructor(){
    this.home = index()
    }
     welcome(){
        let homePage = document.getElementById("app")
        homePage.innerHTML = `<h1>Welcome to Tadalas</h1>`  
        const produtosGrid = document.createElement("div")
        produtosGrid.id = "produtos-grid"
        homePage.appendChild(produtosGrid)
        const produtos = this.home.produtos()
        produtos.forEach(produto => {
            const produtoCard = document.createElement("div")
            produtoCard.className = "produto-card"
            produtoCard.innerHTML = `<h2>${item.produto}</h2>`
            produtosGrid.appendChild(produtoCard)
        })
    }
    produtos(){
        const produtos = [{"produto": "hamburguer"},{"produto": "pizza"}, {"produto": "refrigerante"}, {"produto": "batata frita"}]
        return produtos
    }

}
export default index