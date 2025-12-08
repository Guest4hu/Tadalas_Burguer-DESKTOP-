import Importacao from './ìmportacao.js';

let dados = [{
    caminho: "produstos:listar",
    funcao: console.log("oi")
}
]



async function ChamarIPC(array){
    dados.forEach(dados => {
        console.log(`${dados.caminho}`,() => {dados.funcao})
    })
}

ChamarIPC(dados)





let importacao = new Importacao

importacao.ProdutosController.Listar()


console.log()

