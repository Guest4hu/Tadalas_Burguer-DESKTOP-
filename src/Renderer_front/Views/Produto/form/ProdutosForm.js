import ProdutosView from "../ProdutosView";

class ProdutosForm {
    constructor(){
        this.view = new ProdutosView
    }

    renderizarFormulario(){
        setTimeout(() => {
            this.adicionarEventos()
            console.log("evento criado")
        }, 0)
        return this.view.renderizarFormulario()
    }
    adicionarEventos() {
        const formulario = document.getElementById('form-usuario')
        formulario.addEventListener('submit', async (event) => {
            event.preventDefault()
            console.log(event)
            const nome = document.getElementById('nome')
            const produto = { nome: nome.value }
            const resultado = await window.api.cadastrar(nome)

            if(resultado){
                nome.value = ''
            }
        })
    }
}

export default ProdutosForm