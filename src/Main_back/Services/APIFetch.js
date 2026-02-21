import { net } from 'electron';
import { app } from 'electron';
import path from 'node:path';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import CategoriaModel from '../Models/Categorias.js';
import EnderecoModel from '../Models/Enderecos.js';
import ItemPedidoModel from '../Models/ItensPedidos.js';
import PagamentoModel from '../Models/Pagamentos.js';
import PedidoModel from '../Models/Pedidos.js';
import ProdutoModel from '../Models/Produtos.js';
import UsuarioModel from '../Models/Usuarios.js';

// Carrega variáveis de ambiente do arquivo .env
function loadEnvVariables() {
  const isDev = !app.isPackaged;
  
  // Lista de caminhos possíveis para o .env (em ordem de prioridade)
  const possiblePaths = isDev 
    ? [
        path.join(process.cwd(), '.env'),
      ]
    : [
        // 1. Junto ao executável (pasta de instalação)
        path.join(path.dirname(app.getPath('exe')), '.env'),
        // 2. Na pasta de dados do usuário (%APPDATA%/Desk)
        path.join(app.getPath('userData'), '.env'),
        // 3. Dentro do pacote ASAR (resources)
        path.join(process.resourcesPath, '.env'),
        // 4. Uma pasta acima do exe (algumas instalações NSIS)
        path.join(path.dirname(app.getPath('exe')), '..', '.env'),
      ];
  
  let envPath = null;
  
  // Tenta encontrar o .env em um dos caminhos possíveis
  for (const testPath of possiblePaths) {
    console.log(`[ENV] Verificando: ${testPath}`);
    if (existsSync(testPath)) {
      envPath = testPath;
      console.log(`[ENV] Arquivo .env encontrado em: ${envPath}`);
      break;
    }
  }
  
  if (envPath) {
    try {
      const envContent = readFileSync(envPath, 'utf-8');
      envContent.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...valueParts] = trimmedLine.split('=');
          const value = valueParts.join('=').trim();
          if (key && value) {
            process.env[key.trim()] = value;
          }
        }
      });
      console.log('[ENV] Variáveis de ambiente carregadas com sucesso!');
    } catch (error) {
      console.error('[ENV] Erro ao ler arquivo .env:', error.message);
    }
  } else {
    console.warn('[ENV] Arquivo .env não encontrado em nenhum dos caminhos.');
    console.warn('[ENV] Caminhos verificados:', possiblePaths);
    
    // Em produção, cria um .env de exemplo na pasta userData para o usuário configurar
    if (!isDev) {
      const userDataEnvPath = path.join(app.getPath('userData'), '.env');
      const envTemplate = `# Configuração Tadalas Burguer
# Cole sua chave de API abaixo:
API_KEY=sua_chave_api_aqui
API_BASE_URL=http://localhost:8000/backend/desktop/api
`;
      try {
        writeFileSync(userDataEnvPath, envTemplate, 'utf-8');
        console.log(`[ENV] Arquivo .env de exemplo criado em: ${userDataEnvPath}`);
        console.log('[ENV] Por favor, edite este arquivo e adicione sua API_KEY');
      } catch (err) {
        console.error('[ENV] Não foi possível criar .env:', err.message);
      }
    }
  }
}

loadEnvVariables();

class APIFetch {
  constructor(){
    // Carrega credenciais de variáveis de ambiente (SEGURO)
    this.chave = process.env.API_KEY || '';
    this.urlBase = process.env.API_BASE_URL || 'http://localhost:8000/backend/desktop/api';
    
    // Validação de segurança
    if (!this.chave) {
      console.error('[SEGURANÇA] API_KEY não configurada! Configure no arquivo .env');
    }
    
    this.categoriaModel = new CategoriaModel();
    this.enderecoModel = new EnderecoModel();
    this.itemPedidoModel = new ItemPedidoModel();
    this.pagamentoModel = new PagamentoModel();
    this.pedidoModel = new PedidoModel();
    this.produtoModel = new ProdutoModel();
    this.usuarioModel = new UsuarioModel();
  }

  async fetchData(url, method = 'GET' , dados = null){
    if (!net.isOnline()){
      return {sucess: false, message:"Sem conexão com a internet"};
    }
      const config ={
        method: method,
        cache: "no-store",
        headers:{
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.chave}`
        }
      }
      if (dados) {
        config.body = JSON.stringify(dados);
      }
      const response = await fetch(url, config)
      const data = await response.json();
      return {sucess: true, dados: data};
  }


  
  async sincronizarDados(controller) {
    if (!net.isOnline()) {
      console.log('[Sync] Sem internet. Abortando.');
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

       console.log('[Sync] Enviando...');
      const response = await fetch(`${this.urlBase}/${controller}`, config);
  
      if (!response.ok) throw new Error(`Erro ao sincronizar dados`)
  
        const data = await response.json();
        //console.log('[Sync] Resposta recebida:', data.dados);
        return {sucess: true, dados: data};

      
    } catch (error) {
      console.error('[Sync] Erro:', error);
      return {sucess: false, message: error.message};
    }
  }

  async enviarDadosLocais(controller) {
    if (!net.isOnline()) {
       console.log('[Sync Upload] Sem internet. Tentaremos depois.');
      return {sucess: false, message: 'Sem conexão com a internet'};
    }

  const dadosLocaisPendentes = await this.buscarDadosLocais(controller);


    if (dadosLocaisPendentes.length === 0) {
      console.log('[Sync Upload] Nada para enviar.');
      return;
    }

  console.log(`[Sync Upload] Enviando ${dadosLocaisPendentes.length} registros...`);    
    


 for (const element of dadosLocaisPendentes) {
      try{
         const response = await fetch(`${this.urlBase}/${controller}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.chave}`
          },
          body: JSON.stringify(element)
        });

        if (!response.ok) {
          const erro = await response.json();
          console.error(`[Sync Upload] Erro ao enviar ${element}:`, erro);
          continue; 
        }

        const jsonResponse = await response.json();
        if (jsonResponse.status === 'success') {
           console.log(`[Sync Upload] Sucesso: ${element} sincronizado.`);
           this.element.marcarComoSincronizado(element.uuid);
        }
      } catch (error) {
          console.error(`[Sync Upload] Exceção ao processar elemento: ${element}`, error);
      }
  }
}
  async buscarDadosLocais(){
    const fontes = {
      categorias: await this.categoriaModel.listarPendentes(),
      enderecos: await this.enderecoModel.listarPendentes(),
      itensPedidos: await this.itemPedidoModel.listarPendentes(),
      pagamentos: await this.pagamentoModel.listarPendentes(),
      pedidos: await this.pedidoModel.listarPendentes(),
      produtos: await this.produtoModel.listarPendentes(),
      usuarios: await this.usuarioModel.listarPendentes(),
    };

    console.log(fontes);

    const dados = Object.fromEntries(
      Object.entries(fontes).filter(([, valor]) => valor?.length)
    );
    return dados;
  }




}
export default new APIFetch();