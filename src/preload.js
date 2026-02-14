// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld(
    'ElectronAPI', {
        enviarCodigoRecuperacao: (email) => ipcRenderer.invoke('enviar-codigo-recuperacao', email),
        authenticated: () => ipcRenderer.invoke('authenticated'),
        getProducts: async () => ipcRenderer.invoke('get-products'),
        getCategories: async () => ipcRenderer.invoke('get-categories'),
        getUserData: async () => ipcRenderer.invoke('get-user-data'),
        getAdressData: async () => ipcRenderer.invoke('get-adress-data'),
        getCEPaddress: async (cepInput) => ipcRenderer.invoke('getcepaddress', cepInput),
        confirmOrder: async (orderData) => ipcRenderer.invoke('confirm-order', orderData),
        checkLogin: async (dados) => ipcRenderer.invoke('fazer-login', dados),
        getEmployeData: async () => ipcRenderer.invoke('get-employe-data')
    },
)