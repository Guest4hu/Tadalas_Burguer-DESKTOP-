import index from "./Home";
class entrar{
    constructor(){
        this.index = new index()
    }
    entrarPage(){
        const entrarPage = document.getElementById("app")
        const btn = document.createElement("button")
        btn.id = "btn"
        entrarPage.appendChild(btn)
        btn.innerText = "Entrar"
        btn.addEventListener('click', () => {
            this.index.welcome()
        })
    }
}
export default entrar