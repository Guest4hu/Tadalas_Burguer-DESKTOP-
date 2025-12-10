import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import UsuarioController from './Main_back/Controllers/UsuarioController.js';
import { initDatabase } from './Main_back/Database/db.js';
import APIFetch from './Main_back/Services/APIFetch.js';
if (started) {
  app.quit();
}
const controlerUsuario = new UsuarioController();
const apiremoto = new APIFetch

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    transparent: false,
    alwaysOnTop: false,
    resizable: true,
    fullscreen: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

};

app.whenReady().then(() => {
  createWindow();
initDatabase();
  app.on('activate', (async) => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

ipcMain.handle("usuarios:buscarPorId", async (event, uuid) => {
  return await controlerUsuario.buscarUsuarioPorId(uuid);
})
ipcMain.handle("usuarios:removerusuario", async (event, uuid) => {
  return await controlerUsuario.removerUsuario(uuid);
})

ipcMain.handle("usuarios:listar", async () => {
  return await controlerUsuario.listar();
})

ipcMain.handle("usuarios:cadastrar", async (event, usuario) => {
   const resultado = await controlerUsuario.cadastrar(usuario);
   return resultado;
})

ipcMain.handle("usuarios:editar", async (event, usuario) => {
   const resultado = await controlerUsuario.atualizarUsuario(usuario);
   return resultado;
})

// async function buscarUsuariosRemoto(){
//   const resultado = await apiremoto.fetchU("usuarios")
//   await controlerUsuario.sincronizarAPIlocal(resultado.data.data)
// }
// return buscarUsuariosRemoto();
 
async function sincALLdata(){
  const resultado = await apiremoto.fetchALL("datas")
  await controlerUsuario.sincAllAPIslocal(resultado.data.data)
}
return sincALLdata();

});




app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


