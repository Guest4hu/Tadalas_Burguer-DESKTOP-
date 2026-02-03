import { net } from 'electron';
import CategoriaModel from '../Models/Categorias.js';
import EnderecoModel from '../Models/Enderecos.js';
import ItemPedidoModel from '../Models/ItensPedidos.js';
import PagamentoModel from '../Models/Pagamentos.js';
import PedidoModel from '../Models/Pedidos.js';
import ProdutoModel from '../Models/Produtos.js';
import UsuarioModel from '../Models/Usuarios.js';

export default class APIFetch {
  constructor(){
    this.chave = '5d242b5294d72df332ca2c492d2c0b9b'
    this.urlBase = `http://localhost:8000/backend/`
    this.categoriaModel = new CategoriaModel();
    this.enderecoModel = new EnderecoModel();
    this.itemPedidoModel = new ItemPedidoModel();
    this.pagamentoModel = new PagamentoModel();
    this.pedidoModel = new PedidoModel();
    this.produtoModel = new ProdutoModel();
    this.usuarioModel = new UsuarioModel();
  }
  
  async sincronizarDados(url, controller) {
    if (!net.isOnline()) {
      return {sucess: false, message: 'Sem conexão com a internet'};
    }
    
    
    try{
      const config = {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.chave}`
        }
      };

      const response = await fetch(`${this.urlBase}${controller}/api/${url}`, config);
  
      if (!response.ok) throw new Error(`Erro ao sincronizar dados`)
  
        const data = await response.json();
        return {sucess: true, dados: data};

      
    } catch (error) {
      return {sucess: false, message: error.message};
    }
  }

  async enviarDadosLocais(controller, url) {
    if (!net.isOnline()) {
      return {sucess: false, message: 'Sem conexão com a internet'};
    }

  const dadosLocaisPendentes = await this.buscarDadosLocais();

 for (const element of dadosLocaisPendentes) {
      try{
         const response = await fetch(`${this.urlBase}${controller}/api/${url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.chave}`
          },
          body: JSON.stringify(element)
        });

        if (!response.ok) {
            continue; 
        }

        const jsonResponse = await response.json();
        if (jsonResponse.status === 'success') {
        }
      } catch (error) {
          console.error(`[Sync Upload] Exceção ao processar elemento:`, error);
      }
  }
}


  async buscarDadosLocais(){
    const fontes = {
  categorias: this.categoriaModel.listarPendentes(),
  enderecos: this.enderecoModel.listarPendentes(),
  itensPedidos: this.itemPedidoModel.listarPendentes(),
  pagamentos: this.pagamentoModel.listarPendentes(),
  pedidos: this.pedidoModel.listarPendentes(),
  produtos: this.produtoModel.listarPendentes(),
  usuarios: this.usuarioModel.listarPendentes(),
};

const dados = Object.fromEntries(
  filter(([, valor]) => valor.length)
);
  
return dados;
}
}
