
export class CartManager {
    constructor(callbacks) {
        this.cart = [];
        this.callbacks = callbacks; // e.g. onCheckout
    }

    init() {
        this.updateCartUI();
        this.setupEventListeners();
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.produto_id === product.produto_id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.updateCartUI();
    }

    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.produto_id !== id);
        this.updateCartUI();
    }

    increaseQuantity(id) {
        const item = this.cart.find(i => i.produto_id === id);
        if (item) {
            item.quantity++;
            this.updateCartUI();
        }
    }

    decreaseQuantity(id) {
        const item = this.cart.find(i => i.produto_id === id);
        if (item && item.quantity > 1) {
            item.quantity--;
            this.updateCartUI();
        }
    }

    clearCart() {
        if (confirm('Deseja limpar o carrinho?')) {
            this.cart = [];
            this.updateCartUI();
        }
    }

    getItems() {
        return this.cart;
    }

    clearWithoutConfirmation() {
        this.cart = [];
        this.updateCartUI();
    }

    updateCartUI() {
        const cartItemsDiv = document.getElementById('cartItems');
        const itemCount = document.getElementById('cartItemCount');
        const finishBtn = document.getElementById('finishSaleBtn');

        if (!cartItemsDiv) return;

        if (this.cart.length === 0) {
            cartItemsDiv.innerHTML = `
                <div class="empty-cart">
                    <i class="fa fa-shopping-basket"></i>
                    <p>Carrinho vazio<br>Adicione produtos para começar</p>
                </div>
            `;
            if (finishBtn) finishBtn.disabled = true;
        } else {
            cartItemsDiv.innerHTML = '';
            this.cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <figure alt="${item.nome}">
                                <img 
                                    src="${item.foto_produto}" 
                                    alt="${item.nome}"
                                    onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\'fa fa-image\'></i>';"
                                />
                            </figure>
                        </div>
                        
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.nome}</div>
                            <div class="cart-item-price">R$ ${item.preco.toFixed(2)}</div>
                        </div>
                        
                        <div class="cart-item-controls">
                            <div class="quantity-control">
                                <button class="qty-btn" data-action="decrease" data-id="${item.produto_id}">
                                    <i class="fa fa-minus"></i>
                                </button>
                                <span class="qty-value">${item.quantity}</span>
                                <button class="qty-btn" data-action="increase" data-id="${item.produto_id}">
                                    <i class="fa fa-plus"></i>
                                </button>
                            </div>
                            <span class="remove-btn" data-id="${item.produto_id}">
                                <i class="fa fa-trash"></i> Remover
                            </span>
                        </div>
                    </div>
                `;
                cartItemsDiv.appendChild(cartItem);
            });
            if (finishBtn) finishBtn.disabled = false;
        }

        this.updateTotals();
        this.attachCartItemListeners();
    }

    updateTotals() {
        const itemCount = document.getElementById('cartItemCount');
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');

        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = this.cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);

        if (itemCount) itemCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
        if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
    }

    attachCartItemListeners() {
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const action = btn.dataset.action;
                if (action === 'increase') this.increaseQuantity(id);
                else if (action === 'decrease') this.decreaseQuantity(id);
            };
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.removeFromCart(id);
            };
        });
    }

    setupEventListeners() {
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }

        const finishSaleBtn = document.getElementById('finishSaleBtn');
        if (finishSaleBtn) {
            finishSaleBtn.addEventListener('click', () => {
                if (this.callbacks.onCheckout) this.callbacks.onCheckout(this.cart);
            });
        }
    }
}
