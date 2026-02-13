
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

    async renderizar() {
        return Layout.render();
    }

    async ativarEventos() {
        // Initialize Managers
        await this.productManager.init();
        this.cartManager.init();
        await this.checkoutManager.init();

    }

  

    handleOrderConfirmation(orderData) {
        console.log('Order Data:', orderData);

        // Display Success Message
        let orderTypeText = 'Pedido';
        if (orderData.orderType === 'local') orderTypeText = 'Pedido (Consumo Local)';
        if (orderData.orderType === 'retirada') orderTypeText = 'Pedido (Retirada)';
        if (orderData.orderType === 'entrega') orderTypeText = 'Pedido (Entrega)';


        // Display Success Message
        this.notificacao.notificacaoMensagem('success', `Pedido confirmado com sucesso!`);

        this.cartManager.clearWithoutConfirmation();
    }
}