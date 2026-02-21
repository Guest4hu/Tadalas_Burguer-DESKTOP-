import { app, BrowserWindow, ipcMain, net, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

import { initDatabase } from './Main_back/Database/db.js';
import APIFetch from './Main_back/Services/APIFetch.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Importação dos Controller
import ProdutosController from './Main_back/Controllers/ProdutosController.js'
import UsuariosController from './Main_back/Controllers/UsuariosController.js'
import LoginController from './Main_back/Controllers/LoginController.js'
import PagamentoController from './Main_back/Controllers/PagamentosController.js';
import ItemPedidoController from './Main_back/Controllers/ItemPedidosController.js';
import EnderecoController from './Main_back/Controllers/EnderecosController.js';
import CategoriaController from './Main_back/Controllers/CategoriasController.js';
import PedidoController from './Main_back/Controllers/PedidosController.js';
import Dominio from './Main_back/Controllers/DominioController.js';
import { clear } from 'node:console';





// Handle creating/removing shortcuts on Windows when installing/uninstalling.

// Puxando as variáveis do Controller
const controllerDominio = new Dominio()
const controllerProdutos = new ProdutosController()
const controllerUsuarios = new UsuariosController()
const controllerLogin = new LoginController()
const controllerPagamentos = new PagamentoController()
const controllerItemPedidos = new ItemPedidoController()
const controllerEnderecos = new EnderecoController()
const controllerCategorias = new CategoriaController()
const controllerPedidos = new PedidoController()




function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false, // 🔥 REMOVE BARRA PADRÃO
    backgroundColor: '#121212',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // 🔥 REMOVE MENU PADRÃO
  Menu.setApplicationMenu(null);

  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  return win;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  
  createWindow();
  initDatabase();

  ipcMain.on('window-minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.minimize();
});

ipcMain.on('window-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});

ipcMain.on('window-close', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.close();
});

ipcMain.handle('authenticated',() => {
    return controllerLogin.isAuthenticated();
  });

  ipcMain.handle('enviar-codigo-recuperacao', async (event, email) => {
    const resultado = await controllerLogin.enviarCodigoRecuperacao(email);
    return resultado;
  });

  ipcMain.handle('get-products', async () => {
    const produtos = await controllerProdutos.listar();
    return produtos;
  });

  ipcMain.handle('get-categories', async () => {
    const categorias = await controllerCategorias.listar();
    return categorias;
   });

   ipcMain.handle('get-user-data', async () => {
    const userData = await controllerUsuarios.listar();
    return userData;
   });

   ipcMain.handle('get-adress-data', async () => {
    const adressData = await controllerEnderecos.listar();
    return adressData
   })

    ipcMain.handle('getcepaddress', async (event, cepInput) =>{
        console.log("Chamando searchCEP...");
        return await controllerEnderecos.searchCEP(cepInput);
    })

    ipcMain.handle('confirm-order', async (event, orderData) => {
        await controllerPedidos.confirmarPedido(orderData);
    });

    ipcMain.handle('fazer-login', async (event, dados) => {
      return await controllerLogin.validarCredenciais(dados.email, dados.senha);
    })

    ipcMain.handle('get-employe-data', async () => {
      const employeData = await controllerLogin.getLoggedEmployeData();
      return employeData;
     })


async function sincronizarSeOnline() {
  console.log('[Main] Verificando conexão...');
  const isOnline = net.isOnline();
  
  if (!isOnline) {
    console.log('[Main] Sem conexão com internet. Sincronização ignorada.');
    return;
  }

  console.log('[Main] Aplicativo online. Iniciando sincronização automática...');
  
  try {
    // Buscar dados da API
    const dominioStatusPedido = await APIFetch.sincronizarDados('dominioStatusPedido');
    const dominioTipoUsuario = await APIFetch.sincronizarDados('dominioTipoUsuario');
    const dominioTipoPedido = await APIFetch.sincronizarDados('dominioTipoPedido');
    const dominioStatusPagamento = await APIFetch.sincronizarDados('dominioStatusPagamento');
    const dominioMetodoPagamento = await APIFetch.sincronizarDados('dominioMetodoPagamento');
    const categorias = await APIFetch.sincronizarDados('categorias');
    const produtos = await APIFetch.sincronizarDados('produtos');
    const usuarios = await APIFetch.sincronizarDados('usuarios');
    const pedidos = await APIFetch.sincronizarDados('pedidos');
    const enderecos = await APIFetch.sincronizarDados('enderecos');

    //===== DOMINIOS =====
    await controllerDominio.cadastrarLocalmente(dominioStatusPedido, 'statusPedido');
    await controllerDominio.cadastrarLocalmente(dominioTipoUsuario, 'tipoUsuario');
    await controllerDominio.cadastrarLocalmente(dominioTipoPedido, 'tipoPedido');
    await controllerDominio.cadastrarLocalmente(dominioStatusPagamento, 'statusPagamento');
    await controllerDominio.cadastrarLocalmente(dominioMetodoPagamento, 'metodoPagamento');

    // ===== CATEGORIAS =====
    await controllerCategorias.cadastrarLocalmente(categorias);

    // ===== PRODUTOS =====
    await controllerProdutos.cadastrarLocalmente(produtos);

    // ===== USUARIOS =====
    await controllerUsuarios.cadastrarLocalmente(usuarios);

    // ===== PEDIDOS =====
    await controllerPedidos.cadastrarLocalmente(pedidos);

    // ===== ENDERECOS =====
    await controllerEnderecos.cadastrarLocalmente(enderecos);

    console.log('[Main] Sincronização concluída com sucesso!');
  } catch (error) {
    console.error('[Main] Erro durante sincronização:', error.message);
  }
}

sincronizarSeOnline();


const INTERVALO_SYNC =  1000 * 60 * 1; 

  const syncInterval = setInterval(async () => {
    sincronizarSeOnline();
  }, INTERVALO_SYNC);

  app.on('before-quit', () => {
    clearInterval(syncInterval);
  });

  
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
