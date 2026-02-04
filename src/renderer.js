/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import Rotas from './Renderer_front/Services/Rotas'


const rota_mapeada = new Rotas()

async function navegarPara(rota){
    const html = await rota_mapeada.getPage(rota)
    document.querySelector('#app').innerHTML = html
    console.log(document.getElementById('app'))
}

window.addEventListener('hashchange', async () => {
    const rota = window.location.hash.replace('#', '/')
    await navegarPara(rota)
})

navegarPara('/renderizar_login')