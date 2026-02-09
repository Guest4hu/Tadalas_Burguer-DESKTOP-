export default class PDV {
    constructor() {
        this.cart = [];
        this.selectedPaymentMethod = 'dinheiro';
    }

    async renderizar() {
        console.log("PDV carregando...");
        return `
            <!-- Window Chrome -->
            <div class="window-chrome">
                <div class="window-title">
                    <i class="fa fa-shopping-cart"></i>
                    PDV - Ponto de Vendas
                </div>
                <div class="window-controls">
                    <div class="window-btn close"></div>
                    <div class="window-btn minimize"></div>
                    <div class="window-btn maximize"></div>
                </div>
            </div>

            <!-- Main Container -->
            <div class="pdv-container">
                <!-- Left Panel - Products -->
                <div class="pdv-products">
                    <!-- Search Bar -->
                    <div class="search-bar">
                        <div class="search-input-group">
                            <i class="fa fa-search search-icon"></i>
                            <input type="text" class="search-input" id="searchInput" placeholder="Buscar produtos...">
                        </div>
                    </div>

                    <!-- Categories -->
                    <div class="categories">
                        <button class="category-btn active" data-category="todos">
                            <i class="fa fa-th"></i> Todos
                        </button>
                        <button class="category-btn" data-category="bebidas">
                            <i class="fa fa-coffee"></i> Bebidas
                        </button>
                        <button class="category-btn" data-category="lanches">
                            <i class="fa fa-cutlery"></i> Lanches
                        </button>
                        <button class="category-btn" data-category="doces">
                            <i class="fa fa-birthday-cake"></i> Doces
                        </button>
                        <button class="category-btn" data-category="salgados">
                            <i class="fa fa-fire"></i> Salgados
                        </button>
                    </div>

                    <!-- Products Grid -->
                    <div class="products-grid" id="productsGrid">
                        <!-- Products will be loaded here -->
                    </div>
                </div>

                <!-- Right Panel - Cart -->
                <div class="pdv-cart">
                    <!-- Cart Header -->
                    <div class="cart-header">
                        <h2>
                            <i class="fa fa-shopping-cart"></i>
                            Carrinho
                        </h2>
                        <div class="cart-info">
                            <div class="cart-info-item">
                                <i class="fa fa-cube"></i>
                                <span id="cartItemCount">0 itens</span>
                            </div>
                            <div class="cart-info-item">
                                <i class="fa fa-user"></i>
                                <span>Operador: Admin</span>
                            </div>
                        </div>
                    </div>

                    <!-- Cart Items -->
                    <div class="cart-items" id="cartItems">
                        <div class="empty-cart">
                            <i class="fa fa-shopping-basket"></i>
                            <p>Carrinho vazio<br>Adicione produtos para começar</p>
                        </div>
                    </div>

                    <!-- Cart Summary -->
                    <div class="cart-summary">
                        <div class="summary-row">
                            <span class="summary-label">Subtotal:</span>
                            <span class="summary-value" id="subtotal">R$ 0,00</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Desconto:</span>
                            <span class="summary-value" id="discount">R$ 0,00</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span id="total">R$ 0,00</span>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="cart-actions">
                        <button class="btn btn-primary" id="finishSaleBtn" disabled>
                            <i class="fa fa-check"></i>
                            Finalizar Venda
                        </button>
                        <button class="btn btn-secondary" id="clearCartBtn">
                            <i class="fa fa-trash"></i>
                            Limpar Carrinho
                        </button>
                    </div>
                </div>
            </div>

            <!-- Payment Modal -->
            <div class="modal-overlay" id="paymentModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Finalizar Pagamento</h2>
                        <p style="color: var(--muted); font-size: 14px; margin-top: 4px;">
                            Total: <strong id="modalTotal" style="color: var(--success);">R$ 0,00</strong>
                        </p>
                    </div>

                    <div class="payment-methods">
                        <div class="payment-method selected" data-method="dinheiro">
                            <i class="fa fa-money" style="color: var(--success);"></i>
                            <span>Dinheiro</span>
                        </div>
                        <div class="payment-method" data-method="debito">
                            <i class="fa fa-credit-card" style="color: #3b82f6;"></i>
                            <span>Débito</span>
                        </div>
                        <div class="payment-method" data-method="credito">
                            <i class="fa fa-credit-card-alt" style="color: var(--gold);"></i>
                            <span>Crédito</span>
                        </div>
                        <div class="payment-method" data-method="pix">
                            <i class="fa fa-qrcode" style="color: #00d9c0;"></i>
                            <span>PIX</span>
                        </div>
                    </div>

                    <div id="cashPayment">
                        <div class="input-group">
                            <label class="input-label">Valor Recebido</label>
                            <input type="text" class="modal-input" id="receivedAmount" placeholder="R$ 0,00">
                        </div>
                        <div class="summary-row" style="margin-bottom: 24px;">
                            <span class="summary-label">Troco:</span>
                            <span class="summary-value" id="changeAmount" style="color: var(--gold);">R$ 0,00</span>
                        </div>
                    </div>

                    <div style="display: flex; gap: 12px;">
                        <button class="btn btn-secondary" id="cancelPaymentBtn" style="flex: 1;">
                            <i class="fa fa-times"></i>
                            Cancelar
                        </button>
                        <button class="btn btn-primary" id="confirmPaymentBtn" style="flex: 2;">
                            <i class="fa fa-check"></i>
                            Confirmar Pagamento
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async ativarEventos() {
        console.log("Inicializando eventos do PDV...");
        await this.loadProducts();
        this.loadCategories();
        this.setupEventListeners();
    }

    async loadProducts(category = 'todos', searchTerm = '') {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        grid.innerHTML = '';


        try {
           const products = await window.ElectronAPI.getProducts();

            console.log('Produtos carregados:', products);


            const filtered = products.filter(p => {
                const matchCategory = category === 'todos' || p.category === category;
                const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
                return matchCategory && matchSearch;
            });
   
           filtered.forEach(product => {
               const card = document.createElement('div');
               card.className = 'product-card';
               card.innerHTML = `
                   <div class="product-image">
                       <img src="${product.foto_produto}">
                   </div>
                   <div class="product-name">${product.nome}</div>
                   <div class="product-description">${product.descricao}</div>
                   <div class="product-stock">Estoque: ${product.estoque}</div>
                   <div class="product-price">R$ ${product.preco.toFixed(2)}</div>
                   <input type="hidden" value="${product.id}" />
               `;
               card.onclick = () => this.addToCart(product);
               grid.appendChild(card);
           });
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            grid.innerHTML = '<p style="color: var(--danger);">Erro ao carregar produtos. Tente novamente mais tarde.</p>';            
        }
    }

    loadCategories() {


    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        
        this.updateCart();
    }

    updateCart() {
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
                    <div class="cart-item-image">
                        <i class="fa fa-${item.icon}"></i>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="qty-btn" data-action="decrease" data-id="${item.id}">
                                <i class="fa fa-minus"></i>
                            </button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn" data-action="increase" data-id="${item.id}">
                                <i class="fa fa-plus"></i>
                            </button>
                        </div>
                        <span class="remove-btn" data-id="${item.id}">
                            <i class="fa fa-trash"></i> Remover
                        </span>
                    </div>
                `;
                cartItemsDiv.appendChild(cartItem);
            });
            if (finishBtn) finishBtn.disabled = false;
        }

        // Update totals
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (itemCount) itemCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
        
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `R$ ${subtotal.toFixed(2)}`;

        // Re-attach event listeners for cart items
        this.attachCartItemListeners();
    }

    attachCartItemListeners() {
        // Quantity buttons
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const action = btn.dataset.action;
                
                if (action === 'increase') {
                    this.increaseQuantity(id);
                } else if (action === 'decrease') {
                    this.decreaseQuantity(id);
                }
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.removeFromCart(id);
            });
        });
    }

    increaseQuantity(id) {
        const item = this.cart.find(i => i.id === id);
        if (item) {
            item.quantity++;
            this.updateCart();
        }
    }

    decreaseQuantity(id) {
        const item = this.cart.find(i => i.id === id);
        if (item && item.quantity > 1) {
            item.quantity--;
            this.updateCart();
        }
    }

    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.updateCart();
    }

    clearCart() {
        if (confirm('Deseja limpar o carrinho?')) {
            this.cart = [];
            this.updateCart();
        }
    }

    openPaymentModal() {
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const modalTotal = document.getElementById('modalTotal');
        const paymentModal = document.getElementById('paymentModal');
        const receivedAmount = document.getElementById('receivedAmount');
        const changeAmount = document.getElementById('changeAmount');
        
        if (modalTotal) modalTotal.textContent = `R$ ${total.toFixed(2)}`;
        if (paymentModal) paymentModal.classList.add('active');
        if (receivedAmount) receivedAmount.value = '';
        if (changeAmount) changeAmount.textContent = 'R$ 0,00';
    }

    closePaymentModal() {
        const paymentModal = document.getElementById('paymentModal');
        if (paymentModal) paymentModal.classList.remove('active');
    }

    confirmPayment() {
        // Validate payment
        if (this.selectedPaymentMethod === 'dinheiro') {
            const receivedInput = document.getElementById('receivedAmount');
            if (!receivedInput) return;
            
            const received = parseFloat(receivedInput.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            if (received < total) {
                alert('Valor recebido insuficiente!');
                return;
            }
        }

        // Process payment
        alert('Pagamento confirmado com sucesso!');
        this.cart = [];
        this.updateCart();
        this.closePaymentModal();
    }

    setupEventListeners() {
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadProducts(btn.dataset.category);
            });
        });

        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'todos';
                this.loadProducts(activeCategory, e.target.value);
            });
        }

        // Clear cart
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }

        // Finish sale
        const finishSaleBtn = document.getElementById('finishSaleBtn');
        if (finishSaleBtn) {
            finishSaleBtn.addEventListener('click', () => this.openPaymentModal());
        }

        // Payment modal
        const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
        if (cancelPaymentBtn) {
            cancelPaymentBtn.addEventListener('click', () => this.closePaymentModal());
        }

        const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
        if (confirmPaymentBtn) {
            confirmPaymentBtn.addEventListener('click', () => this.confirmPayment());
        }

        // Payment methods
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', () => {
                document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
                method.classList.add('selected');
                this.selectedPaymentMethod = method.dataset.method;
                
                // Show/hide cash payment fields
                const cashPayment = document.getElementById('cashPayment');
                if (cashPayment) {
                    cashPayment.style.display = this.selectedPaymentMethod === 'dinheiro' ? 'block' : 'none';
                }
            });
        });

        // Calculate change
        const receivedAmount = document.getElementById('receivedAmount');
        if (receivedAmount) {
            receivedAmount.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const change = value - total;
                
                const changeAmount = document.getElementById('changeAmount');
                if (changeAmount) {
                    changeAmount.textContent = `R$ ${change >= 0 ? change.toFixed(2) : '0,00'}`;
                }
            });
        }
    }
}