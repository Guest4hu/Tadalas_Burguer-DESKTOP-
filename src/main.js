import { app, BrowserWindow, ipcMain,net } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { initDatabase } from './Main_back/Database/db.js';
import APIFetch from './Main_back/Services/APIFetch.js';




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
if (started) {
  app.quit();
}


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




const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: "100%",
    height: "100%",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  
  createWindow();
  initDatabase();

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
  console.log('[Main]' );
  const isOnline = net.isOnline();
  if (isOnline) {
    console.log('[Main] Aplicativo iniciado com internet. Iniciando sincronização automática...');
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
  await controllerDominio.cadastrarLocalmente(dominioTipoPedido,'tipoPedido');
  await controllerDominio.cadastrarLocalmente(dominioStatusPagamento,'statusPagamento');
  await controllerDominio.cadastrarLocalmente(dominioMetodoPagamento,'metodoPagamento');
  

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
