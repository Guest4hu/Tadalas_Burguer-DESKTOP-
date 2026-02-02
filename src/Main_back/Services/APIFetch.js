import {fetch} from 'node-fetch';
import { net } from 'electron';


export class APIFetch {
  constructor(){
        this.chave = '5d242b5294d72df332ca2c492d2c0b9b'
        this.urlBase = `http://localhost:8000/backend/`
    }

  async FetchDadosGlobal(url, metodo, controller, dados = "") {
    const config = {
      method: metodo,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.chave}`
      }
    };
    if (metodo === "POST") {
      config.body = JSON.stringify(dados);
    }
    const res = await fetch(`${this.urlBase}${controller}/api/${url}`, config);
    return await res.json();
  } 

  async sincronizarDados(url, metodo, controller, dados = "") {

    // Confirmar conexão com a internet
    if (!net.isOnline()) {
      return {sucess: false, message: 'Sem conexão com a internet'};
    }

    try{
      let response = await this.FetchDadosGlobal(url, metodo, controller, dados);

      

    } catch (error) {
      return {sucess: false, message: error.message};
    }

  }

}
