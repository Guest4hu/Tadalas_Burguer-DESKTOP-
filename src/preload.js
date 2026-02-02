// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld(
    'api', {
        listar: () => ipcRenderer.invoke('produtos:listar')
    },
    {
        listarUsuarios: () => ipcRenderer.invoke('usuarios:listarTodosUsuarios')
    }
)