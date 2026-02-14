
import { Layout } from './function/PDV.layout.js';
import { ProductManager } from './function/PDV.products.js';
import { CartManager } from './function/PDV.cart.js';
import { CheckoutManager } from './function/PDV.checkout.js';
import notificacao from '../../Services/Notificacao.js';


export default class PDV {
    constructor() {
        this.notificacao = new notificacao();
        this.cartManager = new CartManager({
            onCheckout: (cartItems) => this.checkoutManager.openModal(cartItems)
        });

        this.productManager = new ProductManager({
            onAddToCart: (product) => this.cartManager.addToCart(product)
        });

        this.checkoutManager = new CheckoutManager({
            onConfirmOrder: (orderData) => this.handleOrderConfirmation(orderData)
        });
    }

    nomeValido(nome) {

    nome = nome.trim();

    if (nome.length < 3) return false;

    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[\s'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

    return regex.test(nome);
}


    async renderizar() {
        return Layout.render();
    }

    async ativarEventos() {
        // Initialize Managers
        await this.productManager.init();
        this.cartManager.init();
        await this.checkoutManager.init();

    }

  

    async handleOrderConfirmation(orderData) {
        console.log('Dados do pedido recebidos para confirmação:', orderData);
        console.log(this.checkoutManager.customers);
        // Validation Orderdata
        if (!orderData.customer.isExisting){
            if (orderData.customer.name === '' ||orderData.customer.phone === '' || orderData.customer.DateOfBirth === '' || !orderData.items || orderData.items.length === 0) {
                this.notificacao.notificacaoMensagem('error', 'Dados do pedido incompletos. Verifique as informações e tente novamente.');
                return;
            }

            
            if(orderData.customer.phone.length  < 10) {
                this.notificacao.notificacaoMensagem('error', 'Número de telefone inválido. Verifique as informações e tente novamente.');
                return;
            }

            if(orderData.customer.DateOfBirth.length < 9) {
                this.notificacao.notificacaoMensagem('error', 'Data de nascimento inválida. Verifique as informações e tente novamente.');
                return;
            }
            if (!this.nomeValido(orderData.customer.name)) {
               this.notificacao.notificacaoMensagem('error', 'Nome contém caracteres inválidos.');
                return;
            }
            if (orderData.customer.phone == this.checkoutManager.customers.find(c => c.telefone == orderData.customer.phone)?.telefone) {
                this.notificacao.notificacaoMensagem('error', 'Número de telefone invalido tente outro.');
                return;
            }

        }





            if(orderData.orderType === 'entrega' && !orderData.address) {
                console.error('Endereço é obrigatório para pedidos de entrega:', orderData);
                this.notificacao.notificacaoMensagem('error', 'Endereço é obrigatório para pedidos de entrega. Verifique as informações e tente novamente.');
                return;
            }

        
        await window.ElectronAPI.confirmOrder(orderData);


        // Display Success Message
        this.notificacao.notificacaoMensagem('success', `Pedido confirmado com sucesso!`);
        this.cartManager.clearWithoutConfirmation();
        this.checkoutManager.closeModal();
    }
}