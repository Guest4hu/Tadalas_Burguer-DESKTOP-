import APIFetch from '../Services/APIFetch.js';
import { net } from 'electron';
import Pedidos from '../Models/Pedidos.js';
import UsuarioModel from '../Models/Usuarios.js';

class PedidoController {

    constructor() {
        this.model = new Pedidos();
        this.newOrderData = [];
        this.api = APIFetch;
        this.userModel = new UsuarioModel();
    }

    async listar() {
        return await this.model.listar();
    }

    async confirmarPedido(orderData) {
        this.newOrderData = [];
        const typeOrder = parseInt(orderData.orderType);
        const paymentMethod = parseInt(orderData.paymentMethod);
        const items = orderData.items.map(items => {
            return {
                id_produto: items.produto_id,
                quantidade: items.quantity,
                preco_unitario: items.preco
            }
        });
        const subtotal = parseFloat(String(orderData.subtotal).replace(/,/g, '.'));
        if (orderData.customer.isExisting) {
            const userID = parseInt(orderData.customer.usuario_id);
            this.newOrderData = {
                usuario_id: userID,
                tipo_pedido_id: typeOrder,
                metodo_pagamento_id: paymentMethod,
                subtotal: subtotal,
                items: items
            };
        }else {
            const newUserData = {
                nome: orderData.customer.name,
                telefone: orderData.customer.phone,
                password: orderData.customer.password
            };
            this.newOrderData = {
                userData: newUserData,
                tipo_pedido_id: typeOrder,
                metodo_pagamento_id: paymentMethod,
                subtotal: subtotal,
                items: items
            };
            };
        if (this.newOrderData.tipo_pedido_id == 3) {            
            this.newOrderData.address = {
                    endereco_id: parseInt(orderData.address.endereco_id),
                    rua: orderData.address.street,
                    numero: orderData.address.number,
                    complemento: orderData.address.complement,
                    bairro: orderData.address.neighborhood,
                    cep: orderData.address.zipCode,
                    referencia: orderData.address.reference
                };
            }            
        if (net.isOnline()) {
            try {
                console.log('Pedido confirmado e enviado para o servidor.', JSON.stringify(this.newOrderData));
                await this.api.fetchData('http://localhost:8000/backend/desktop/api/pedidos/newOrderData', 'POST', this.newOrderData);
                return {success: true, message: 'Pedido confirmado e enviado para o servidor.'};

            } catch (error) {
                console.error('Erro ao enviar pedido:', error);
                return {sucess: false, message: 'Erro ao enviar pedido. Tente novamente.'};

            }
        }
        else {
            console.warn('Sem conexão com a internet. Pedido salvo localmente para sincronização futura.');
            
        }
    }



    async cadastrarLocalmente(pedido) {
        for (const element of pedido.dados) {
            if (await this.model.buscarPorID(element.pedido_id) === true) {
                console.log(`Pedido com ID ${element.pedido_id} já existe. Atualizando...`);
                await this.model.atualizar(element);
               continue;
            }
            console.log(`Cadastrando pedido com ID ${element.pedido_id}...`);
            await this.model.adicionar(element);
        }
    }

    async atualizar(pedido) {
        if (!pedido.uuid) return false;

        const existente = await this.model.buscarPorUUID(pedido.uuid);
        if (!existente) return false;

        return await this.model.atualizar(pedido);
    }

    async buscarPorUUID(uuid) {
        return await this.model.buscarPorUUID(uuid);
    }

    async remover(uuid) {
        const existente = await this.model.buscarPorUUID(uuid);
        if (!existente) return false;

        return await this.model.remover(existente);
    }
}

export default PedidoController;
