class ProdutosView{
    
    renderizarMenu(){
        return `<div class="container">
                    <ul>
                        <li><a href="#produto_listar">Listar produtos</a></li>
                    </ul>
                </div>`
    }
    
    renderizarLista(produtos){
        console.log('chegou em listar')
        let container = ` <div><table>
        <tr>
            <th>Produtos</th>
        </tr>`
        produtos.forEach(produto => {
            container += `<tr><td> ${produto.nome} </td></tr>`           
        });

        container += `</table></div>`

        return container
    }

    renderizarFormulario(){
        return `<form id="form-produto">
                    <label>Nome:</label>
                    <input type="text" id="nome"/>
                    <button>Salvar</button>
                </form>`
    }
}

export default ProdutosView