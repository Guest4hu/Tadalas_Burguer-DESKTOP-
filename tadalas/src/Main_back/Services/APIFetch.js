class APIFetch{
    constructor(){
        this.URLU = 'http://localhost:8090/api/usuarios';
        this.URLP = 'http://localhost:8090/api/produtos';
        this.URLPED = 'http://localhost:8090/api/pedidos';
        this.URLC = 'http://localhost:8090/api/categorias';

    }
    async fetchUsuario(){
        try{
            let rensponse = await fetch(`${this.URLU}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let data = await rensponse.json();
            console.log('dados da api', data);
            return data;
        }catch(error){
            console.error('Erro ao buscar dados da API:', error);
            return null;
        }
     
    }
    async fetchProduto(){
        try{
            let rensponse = await fetch(`${this.URLP}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let data = await rensponse.json();
            console.log('dados da api', data);
            return data;
        }catch(error){
            console.error('Erro ao buscar dados da API:', error);
            return null;
        }
     
    }
    async fetchPedido(){
        try{
            let rensponse = await fetch(`${this.URLPED}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let data = await rensponse.json();
            console.log('dados da api', data);
            return data;
        }catch(error){
            console.error('Erro ao buscar dados da API:', error);
            return null;
        }
     
    }
    async fetchCategoria(){
        try{
            let rensponse = await fetch(`${this.URLC}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let data = await rensponse.json();
            console.log('dados da api', data);
            return data;
        }catch(error){
            console.error('Erro ao buscar dados da API:', error);
            return null;
        }
     
    }
    
    async fetchALL(){
        try{
            let [usuarios, produtos, pedidos, categorias] = await Promise.all([
                this.fetchUsuario(),
                this.fetchProduto(),
                this.fetchPedido(),
                this.fetchCategoria()
            ]);
            return {usuarios, produtos, pedidos, categorias};
        }catch(error){
            console.error('Erro ao buscar dados da API:', error);
            return null;
        }
    }
}
export default APIFetch;