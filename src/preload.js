// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld(
    'ElectronAPI', {
        fazerLogin: (dados) => ipcRenderer.invoke('fazer-login', dados),
        enviarCodigoRecuperacao: (email) => ipcRenderer.invoke('enviar-codigo-recuperacao', email),
        getProducts: async () => ipcRenderer.invoke('get-products'),
        getCategories: async () => ipcRenderer.invoke('get-categories'),
    },
)