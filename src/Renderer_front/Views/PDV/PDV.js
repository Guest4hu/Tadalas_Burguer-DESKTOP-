export default class PDV {
    constructor() {
        this.cart = [];
        this.userData = [];
        this.selectedPaymentMethod = 'dinheiro';
        this.orderType = 'local'; // 'local', 'entrega', 'retirada'
        this.deliveryFee = 5.00;
        this.selectedCustomer = null;
    }

    // ==================== RENDERING ====================
    async renderizar() {
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
                <div class="categories" id="gridCategories">
                    <button class="category-btn active" data-category="todos">
                        <i class="fa fa-th"></i> Todos
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

        <!-- Payment Modal - REDESIGNED -->
        <div class="modal-overlay" id="paymentModal">
            <div class="payment-modal-container">
                <!-- Left Side - Order Details -->
                <div class="payment-modal-left">
                    <div class="modal-header-compact">
                        <h2>Finalizar Pedido</h2>
                        <button class="btn-close-modal" id="closeModalBtn">
                            <i class="fa fa-times"></i>
                        </button>
                    </div>

                    <!-- Order Type -->
                    <div class="form-section">
                        <label class="section-label">Tipo de Pedido</label>
                        <div class="order-type-compact">
                            <div class="order-type-option selected" data-order-type="local">
                                <i class='fa fa-hand-o-down'></i>
                                <span>Local</span>
                            </div>
                            <div class="order-type-option" data-order-type="retirada">
                                <i class="fa fa-shopping-bag"></i>
                                <span>Retirada</span>
                            </div>
                            <div class="order-type-option" data-order-type="entrega">
                                <i class="fa fa-motorcycle"></i>
                                <span>Entrega</span>
                            </div>
                        </div>
                    </div>

                    <!-- Customer Section -->
                    <div id="customerSection" class="form-section" style="display: block;">
                        <label class="section-label">
                            <i class="fa fa-user"></i> Cliente
                        </label>
                        
                        <!-- Customer Quick Actions -->
                        <div class="customer-quick-actions">
                            <button class="btn-quick" id="searchExistingCustomerBtn">
                                <i class="fa fa-search"></i> Buscar
                            </button>
                            <button class="btn-quick" id="newCustomerBtn">
                                <i class="fa fa-user-plus"></i> Novo
                            </button>
                        </div>

                        <!-- Selected Customer -->
                        <div id="selectedCustomerDisplay" class="selected-customer-compact">
                            <div class="customer-info-compact">
                                <strong id="selectedCustomerName"></strong>
                                <small id="selectedCustomerPhone"></small>
                            </div>
                            <button class="btn-remove" id="clearCustomerBtn">
                                <i class="fa fa-times"></i>
                            </button>
                        </div>

                        <!-- Customer Search Compact -->
                        <div id="customerSearchBox" class="compact-search-box" style="display: none;">
                            <input type="text" class="input-compact" id="customerSearchInput" placeholder="Nome ou telefone...">
                            <div id="customerSearchResults" class="search-results-compact"></div>
                        </div>

                        <!-- New Customer Form Compact -->
                        <div id="newCustomerForm" style="display: none;">
                            <input type="text" class="input-compact" id="customerName" placeholder="Nome completo">
                            <input type="tel" class="input-compact" id="customerPhone" placeholder="Telefone">
                        </div>
                    </div>

                    <!-- Delivery Address - Compact -->
                    <div id="deliveryAddressSection" class="form-section" style="display: none;">
                        <label class="section-label">
                            <i class="fa fa-map-marker"></i> Endereço de Entrega
                        </label>
                        <div class="address-compact-grid">
                            <input type="text" class="input-compact" id="addressStreet" placeholder="Rua" style="grid-column: 1 / 3;">
                            <input type="text" class="input-compact" id="addressNumber" placeholder="Nº">
                            <input type="text" class="input-compact" id="addressNeighborhood" placeholder="Bairro">
                            <input type="text" class="input-compact" id="addressZipCode" placeholder="CEP">
                            <input type="text" class="input-compact" id="addressComplement" placeholder="Complemento (opcional)" style="grid-column: 1 / 3;">
                        </div>
                        <div class="delivery-fee-compact">
                            <span>Taxa de Entrega:</span>
                            <strong id="deliveryFee">R$ 5,00</strong>
                        </div>
                    </div>

                    <!-- Observations -->
                    <div class="form-section">
                        <label class="section-label">Observações</label>
                        <textarea class="textarea-compact" id="orderNotes" rows="2" placeholder="Observações sobre o pedido..."></textarea>
                    </div>
                </div>

                <!-- Right Side - Payment -->
                <div class="payment-modal-right">
                    <div class="payment-summary-box">
                        <div class="summary-total">
                            <span>Total do Pedido</span>
                            <div class="total-amount" id="modalTotal">R$ 0,00</div>
                        </div>
                    </div>

                    <!-- Payment Methods -->
                    <div class="form-section">
                        <label class="section-label">Forma de Pagamento</label>
                        <div class="payment-methods-compact">
                            <div class="payment-option selected" data-method="dinheiro">
                                <i class="fa fa-money"></i>
                                <span>Dinheiro</span>
                            </div>
                            <div class="payment-option" data-method="pix">
                                <i class="fa fa-qrcode"></i>
                                <span>PIX</span>
                            </div>
                            <div class="payment-option" data-method="debito">
                                <i class="fa fa-credit-card"></i>
                                <span>Débito</span>
                            </div>
                            <div class="payment-option" data-method="credito">
                                <i class="fa fa-credit-card-alt"></i>
                                <span>Crédito</span>
                            </div>
                        </div>
                    </div>

                    <!-- Cash Payment -->
                    <div id="cashPayment" class="form-section">
                        <label class="section-label">Pagamento em Dinheiro</label>
                        <input type="text" class="input-compact input-money" id="receivedAmount" placeholder="Valor recebido">
                        <div class="change-display">
                            <span>Troco:</span>
                            <strong id="changeAmount">R$ 0,00</strong>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="payment-actions">
                        <button class="btn btn-secondary btn-block" id="cancelPaymentBtn">
                            <i class="fa fa-times"></i> Cancelar
                        </button>
                        <button class="btn btn-primary btn-block" id="confirmPaymentBtn">
                            <i class="fa fa-check"></i> Confirmar Pedido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

    // ==================== INITIALIZATION ====================
    async ativarEventos() {
        await this.loadCategories();
        await this.loadUserData();
        await this.loadProducts();
        this.setupEventListeners();
    }

    // ==================== LOADING DATA ====================

    async loadUserData() {
        const userData = await window.ElectronAPI.getUserData();
        this.userData = userData;
        return;
    }


    async loadProducts(category = 'todos', searchTerm = '') {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        try {
            const products = await window.ElectronAPI.getProducts();
            const filtered = products.filter(p => {
                const matchesCategory = category === 'todos' || p.categoria_id === parseInt(category);
                const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || p.descricao.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesCategory && matchesSearch;
            });

            filtered.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                   <div class="product-image">
                       <img src="${product.foto_produto}" class="product-img" alt="${product.nome}" />
                   </div>
                   <div class="product-name">${product.nome}</div>
                   <div class="product-description">${product.descricao}</div>
                   <div class="product-stock">Estoque: ${product.estoque}</div>
                   <div class="product-price">R$ ${product.preco.toFixed(2)}</div>
                   <input type="hidden" value="${product.produto_id}" />
                   <input type="hidden" value="${product.categoria_id}" />
               `;
                card.onclick = () => this.addToCart(product);
                grid.appendChild(card);
            });
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            grid.innerHTML = '<p style="color: var(--danger);">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
        }
    }

    async loadCategories() {
        const grid = document.getElementById('gridCategories');
        if (!grid) return;

        const categories = await window.ElectronAPI.getCategories();
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.dataset.category = cat.id_categoria;
            btn.innerHTML = `<i class="fa fa-${cat.icone}"></i> ${cat.nome}`;
            grid.appendChild(btn);
        });
    }

    // ==================== CUSTOMER MANAGEMENT ====================
async searchCustomers(searchTerm) {
    try {
        const customers = this.userData;
        
        // Se não tiver termo de busca, retorna array vazio
        if (!searchTerm || searchTerm.trim() === '') {
            return [];
        }
        
        // Se não tiver clientes, retorna vazio
        if (!customers || customers.length === 0) {
            return [];
        }
        
        const term = searchTerm.toLowerCase().trim();
        
        // Filtra os clientes
        const filtered = customers.filter(customer => {
            // Busca por nome
            const matchName = customer.nome && customer.nome.toLowerCase().includes(term);
            
            // Busca por telefone (remove caracteres especiais para comparar)
            const phoneClean = customer.telefone ? customer.telefone.replace(/\D/g, '') : '';
            const searchClean = term.replace(/\D/g, '');
            const matchPhone = searchClean.length > 0 && phoneClean.includes(searchClean);
            
            // Busca por email
            const matchEmail = customer.email && customer.email.toLowerCase().includes(term);
            
            // Retorna true se algum campo corresponder
            return matchName || matchPhone || matchEmail;
        });
        
        console.log('Termo de busca:', term);
        console.log('Clientes filtrados:', filtered.length);
        
        return filtered;
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return [];
    }
}

  displayCustomerSearchResults(customers) {
    const resultsDiv = document.getElementById('customerSearchResults');
    if (!resultsDiv) return;

    if (customers.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">Nenhum cliente encontrado</div>';
        return;
    }

    resultsDiv.innerHTML = '';
    customers.forEach(customer => {
        const customerCard = document.createElement('div');
        customerCard.className = 'customer-result-card';
        customerCard.innerHTML = `
            <div class="customer-result-info">
                <div class="customer-result-name">${customer.nome}</div>
                <div class="customer-result-phone">${customer.telefone}</div>
                ${customer.email ? `<div class="customer-result-email">${customer.email}</div>` : ''}
            </div>
            <button class="btn btn-sm btn-primary">Selecionar</button>
        `;
        
        customerCard.querySelector('button').addEventListener('click', () => {
            this.selectCustomer(customer);
        });
        
        resultsDiv.appendChild(customerCard);
    });
}

    selectCustomer(customer) {
    this.selectedCustomer = customer;
    
    // Update display
    const displayDiv = document.getElementById('selectedCustomerDisplay');
    const nameEl = document.getElementById('selectedCustomerName');
    const phoneEl = document.getElementById('selectedCustomerPhone');
    const searchBox = document.getElementById('customerSearchBox');
    const newCustomerForm = document.getElementById('newCustomerForm');

    if (nameEl) nameEl.textContent = customer.nome;
    if (phoneEl) phoneEl.textContent = customer.telefone;

    if (displayDiv) displayDiv.style.display = 'block';
    if (searchBox) searchBox.style.display = 'none';
    if (newCustomerForm) newCustomerForm.style.display = 'none';

    // Se for entrega e o cliente tem endereço cadastrado, preencher automaticamente
    // Como seus dados não têm endereço separado, você pode adicionar essa funcionalidade depois
    console.log('Cliente selecionado:', customer);
}

    fillAddressFromCustomer(customer) {
        const fields = {
            addressStreet: customer.rua || '',
            addressNumber: customer.numero || '',
            addressComplement: customer.complemento || '',
            addressNeighborhood: customer.bairro || '',
            addressZipCode: customer.cep || '',
            addressReference: customer.referencia || ''
        };

        Object.keys(fields).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.value = fields[fieldId];
        });
    }

    clearSelectedCustomer() {
        this.selectedCustomer = null;
        
        const displayDiv = document.getElementById('selectedCustomerDisplay');
        const customerName = document.getElementById('customerName');
        const customerPhone = document.getElementById('customerPhone');

        if (displayDiv) displayDiv.style.display = 'none';
        if (customerName) customerName.value = '';
        if (customerPhone) customerPhone.value = '';
    }

   showCustomerSearch() {
    const searchBox = document.getElementById('customerSearchBox');
    const newCustomerForm = document.getElementById('newCustomerForm');
    const searchInput = document.getElementById('customerSearchInput');
    const resultsDiv = document.getElementById('customerSearchResults');

    if (searchBox) searchBox.style.display = 'block';
    if (newCustomerForm) newCustomerForm.style.display = 'none';
    
    // Limpa o input e os resultados
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    
    // Limpa os resultados anteriores
    if (resultsDiv) {
        resultsDiv.innerHTML = '';
    }
}

    // ==================== CART MANAGEMENT ====================
    addToCart(product) {
        const existingItem = this.cart.find(item => item.produto_id === product.produto_id);

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
        const item = this.cart.find(i => i.produto_id === id);
        if (item) {
            item.quantity++;
            this.updateCart();
        }
    }

    decreaseQuantity(id) {
        const item = this.cart.find(i => i.produto_id === id);
        if (item && item.quantity > 1) {
            item.quantity--;
            this.updateCart();
        }
    }

    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.produto_id !== id);
        this.updateCart();
    }

    clearCart() {
        if (confirm('Deseja limpar o carrinho?')) {
            this.cart = [];
            this.updateCart();
        }
    }

    // ==================== ORDER TYPE MANAGEMENT ====================
    setOrderType(type) {
        this.orderType = type;
        const customerSection = document.getElementById('customerSection');
        const deliveryAddressSection = document.getElementById('deliveryAddressSection');
    
        
        
        // Mostrar seção de endereço apenas para entrega
        if (deliveryAddressSection) {
            deliveryAddressSection.style.display = type === 'entrega' ? 'block' : 'none';
        }
        
        // Limpar seleção de cliente ao mudar tipo de pedido
        this.clearSelectedCustomer();
        
        this.updateModalTotal();
    }

    updateModalTotal() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
        const deliveryFee = this.orderType === 'entrega' ? this.deliveryFee : 0;
        const total = subtotal + deliveryFee;
        
        const modalTotal = document.getElementById('modalTotal');
        const deliveryFeeEl = document.getElementById('deliveryFee');
        
        if (modalTotal) {
            modalTotal.textContent = `R$ ${total.toFixed(2)}`;
        }
        
        if (deliveryFeeEl) {
            deliveryFeeEl.textContent = `R$ ${this.deliveryFee.toFixed(2)}`;
        }
    }

    // ==================== INPUT MASKS ====================
    applyPhoneMask(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 10) {
            input.value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 5) {
            input.value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length > 2) {
            input.value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        } else {
            input.value = value.replace(/(\d*)/, '$1');
        }
    }

    applyZipCodeMask(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        input.value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    }

    // ==================== PAYMENT MODAL ====================
    openPaymentModal() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
        const paymentModal = document.getElementById('paymentModal');
        const receivedAmount = document.getElementById('receivedAmount');
        const changeAmount = document.getElementById('changeAmount');

        // Reset order type to local
        this.orderType = 'local';
        
        if (paymentModal) paymentModal.classList.add('active');
        if (receivedAmount) receivedAmount.value = '';
        if (changeAmount) changeAmount.textContent = 'R$ 0,00';
        
        // Update modal total
        this.updateModalTotal();
        
        // Reset sections
        const deliveryAddressSection = document.getElementById('deliveryAddressSection');
        
        if (deliveryAddressSection) deliveryAddressSection.style.display = 'none';
        
        // Clear forms
        this.clearDeliveryForm();
        this.clearSelectedCustomer();
        
        // Reset customer search/form visibility
        const searchBox = document.getElementById('customerSearchBox');
        const newCustomerForm = document.getElementById('newCustomerForm');
        const selectedDisplay = document.getElementById('selectedCustomerDisplay');
        
        if (searchBox) searchBox.style.display = 'none';
        if (newCustomerForm) newCustomerForm.style.display = 'none';
        if (selectedDisplay) selectedDisplay.style.display = 'none';
    }

    closePaymentModal() {
        const paymentModal = document.getElementById('paymentModal');
        if (paymentModal) paymentModal.classList.remove('active');
    }

    clearDeliveryForm() {
        const fields = ['customerName', 'customerPhone', 'addressStreet', 'addressNumber', 
                       'addressComplement', 'addressNeighborhood', 'addressZipCode', 'addressReference', 'orderNotes'];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.value = '';
        });
    }

    validateOrderInfo() {
        // Para consumo local, não precisa validar nada
        if (this.orderType === 'local') {
            return true;
        }

        // Para retirada e entrega, precisa de cliente
        if (this.orderType === 'retirada' || this.orderType === 'entrega') {
            // Verificar se tem cliente selecionado OU se preencheu o formulário
            const hasSelectedCustomer = this.selectedCustomer !== null;
            const customerName = document.getElementById('customerName');
            const customerPhone = document.getElementById('customerPhone');
            
            const hasFilledForm = customerName?.value.trim() && customerPhone?.value.trim();

            if (!hasSelectedCustomer && !hasFilledForm) {
                alert('Por favor, selecione um cliente cadastrado ou preencha os dados do novo cliente.');
                return false;
            }

            // Se preencheu o formulário, validar campos obrigatórios
            if (!hasSelectedCustomer) {
                if (!customerName?.value.trim()) {
                    alert('Por favor, preencha o nome do cliente.');
                    customerName?.focus();
                    return false;
                }

                if (!customerPhone?.value.trim()) {
                    alert('Por favor, preencha o telefone do cliente.');
                    customerPhone?.focus();
                    return false;
                }
            }
        }

        // Para entrega, validar endereço
        if (this.orderType === 'entrega') {
            const addressStreet = document.getElementById('addressStreet');
            const addressNumber = document.getElementById('addressNumber');
            const addressNeighborhood = document.getElementById('addressNeighborhood');
            const addressZipCode = document.getElementById('addressZipCode');

            if (!addressStreet?.value.trim()) {
                alert('Por favor, preencha o endereço de entrega.');
                addressStreet?.focus();
                return false;
            }

            if (!addressNumber?.value.trim()) {
                alert('Por favor, preencha o número do endereço.');
                addressNumber?.focus();
                return false;
            }

            if (!addressNeighborhood?.value.trim()) {
                alert('Por favor, preencha o bairro.');
                addressNeighborhood?.focus();
                return false;
            }

            if (!addressZipCode?.value.trim()) {
                alert('Por favor, preencha o CEP.');
                addressZipCode?.focus();
                return false;
            }
        }

        return true;
    }

    getOrderData() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
        const deliveryFee = this.orderType === 'entrega' ? this.deliveryFee : 0;
        const total = subtotal + deliveryFee;

        const orderData = {
            orderType: this.orderType,
            paymentMethod: this.selectedPaymentMethod,
            items: this.cart,
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            total: total,
            notes: document.getElementById('orderNotes')?.value || ''
        };

        // Adicionar informações do cliente (retirada ou entrega)
        if (this.orderType === 'retirada' || this.orderType === 'entrega') {
            if (this.selectedCustomer) {
                orderData.customer = {
                    id: this.selectedCustomer.id,
                    name: this.selectedCustomer.nome,
                    phone: this.selectedCustomer.telefone,
                    isExisting: true
                };
            } else {
                orderData.customer = {
                    name: document.getElementById('customerName')?.value || '',
                    phone: document.getElementById('customerPhone')?.value || '',
                    isExisting: false
                };
            }
        }

        // Adicionar endereço (apenas para entrega)
        if (this.orderType === 'entrega') {
            orderData.address = {
                street: document.getElementById('addressStreet')?.value || '',
                number: document.getElementById('addressNumber')?.value || '',
                complement: document.getElementById('addressComplement')?.value || '',
                neighborhood: document.getElementById('addressNeighborhood')?.value || '',
                zipCode: document.getElementById('addressZipCode')?.value || '',
                reference: document.getElementById('addressReference')?.value || ''
            };
        }

        return orderData;
    }

    confirmPayment() {
        // Validate order info
        if (!this.validateOrderInfo()) {
            return;
        }

        // Validate cash payment
        if (this.selectedPaymentMethod === 'dinheiro') {
            const receivedInput = document.getElementById('receivedAmount');
            if (!receivedInput) return;

            const received = parseFloat(receivedInput.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            const subtotal = this.cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
            const deliveryFee = this.orderType === 'entrega' ? this.deliveryFee : 0;
            const total = subtotal + deliveryFee;

            if (received < total) {
                alert('Valor recebido insuficiente!');
                return;
            }
        }

        // Get order data
        const orderData = this.getOrderData();
        console.log('Pedido confirmado:', orderData);

        // Show success message
        let orderTypeText = 'Pedido';
        if (this.orderType === 'local') orderTypeText = 'Pedido (Consumo Local)';
        if (this.orderType === 'retirada') orderTypeText = 'Pedido (Retirada)';
        if (this.orderType === 'entrega') orderTypeText = 'Pedido (Entrega)';
        
        alert(`${orderTypeText} confirmado com sucesso!`);

        // Clear cart and close modal
        this.cart = [];
        this.updateCart();
        this.closePaymentModal();
    }

    // ==================== EVENT LISTENERS ====================
    setupEventListeners() {
        this.setupCategoryListeners();
        this.setupSearchListener();
        this.setupCartActionListeners();
        this.setupPaymentListeners();
        this.setupOrderTypeListeners();
        this.setupCustomerListeners();
        this.setupInputMasks();
        this.closeModal();
    }


    closeModal(){
        document.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal-overlay');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
            })
    }



    setupCategoryListeners() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadProducts(btn.dataset.category);
            });
        });
    }

    setupSearchListener() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'todos';
                this.loadProducts(activeCategory, e.target.value);
            });
        }
    }

    setupCartActionListeners() {
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }

        const finishSaleBtn = document.getElementById('finishSaleBtn');
        if (finishSaleBtn) {
            finishSaleBtn.addEventListener('click', () => this.openPaymentModal());
        }
    }

    setupPaymentListeners() {
        const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
        if (cancelPaymentBtn) {
            cancelPaymentBtn.addEventListener('click', () => this.closePaymentModal());
        }

        const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
        if (confirmPaymentBtn) {
            confirmPaymentBtn.addEventListener('click', () => this.confirmPayment());
        }

        this.setupPaymentMethodListeners();
        this.setupReceivedAmountListener();
    }

    setupPaymentMethodListeners() {
        document.querySelectorAll('[data-method]').forEach(method => {
            method.addEventListener('click', () => {
                document.querySelectorAll('[data-method]').forEach(m => m.classList.remove('selected'));
                method.classList.add('selected');
                this.selectedPaymentMethod = method.dataset.method;

                const cashPayment = document.getElementById('cashPayment');
                if (cashPayment) {
                    cashPayment.style.display = this.selectedPaymentMethod === 'dinheiro' ? 'block' : 'none';
                }
            });
        });
    }

    setupReceivedAmountListener() {
        const receivedAmount = document.getElementById('receivedAmount');
        if (receivedAmount) {
            receivedAmount.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                const subtotal = this.cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
                const deliveryFee = this.orderType === 'entrega' ? this.deliveryFee : 0;
                const total = subtotal + deliveryFee;
                const change = value - total;

                const changeAmount = document.getElementById('changeAmount');
                if (changeAmount) {
                    changeAmount.textContent = `R$ ${change >= 0 ? change.toFixed(2) : '0,00'}`;
                }
            });
        }
    }

    setupOrderTypeListeners() {
        document.querySelectorAll('[data-order-type]').forEach(method => {
            method.addEventListener('click', () => {
                document.querySelectorAll('[data-order-type]').forEach(m => m.classList.remove('selected'));
                method.classList.add('selected');
                this.setOrderType(method.dataset.orderType);
            });
        });
    }

  setupCustomerListeners() {
    const searchExistingBtn = document.getElementById('searchExistingCustomerBtn');
    if (searchExistingBtn) {
        searchExistingBtn.addEventListener('click', () => this.showCustomerSearch());
    }

    const newCustomerBtn = document.getElementById('newCustomerBtn');
    if (newCustomerBtn) {
        newCustomerBtn.addEventListener('click', () => this.showNewCustomerForm());
    }

    const clearCustomerBtn = document.getElementById('clearCustomerBtn');
    if (clearCustomerBtn) {
        clearCustomerBtn.addEventListener('click', () => this.clearSelectedCustomer());
    }

    const customerSearchInput = document.getElementById('customerSearchInput');
    if (customerSearchInput) {
        let searchTimeout;
        customerSearchInput.addEventListener('input', async (e) => {
            clearTimeout(searchTimeout);
            
            const searchTerm = e.target.value.trim();
            
            // Se o campo estiver vazio, limpa os resultados
            if (searchTerm === '') {
                const resultsDiv = document.getElementById('customerSearchResults');
                if (resultsDiv) resultsDiv.innerHTML = '';
                return;
            }
            
            // Aguarda 300ms após o usuário parar de digitar
            searchTimeout = setTimeout(async () => {
                console.log('Buscando por:', searchTerm);
                const results = await this.searchCustomers(searchTerm);
                console.log('Resultados encontrados:', results);
                this.displayCustomerSearchResults(results);
            }, 300);
        });
    }
}
    setupInputMasks() {
        const customerPhone = document.getElementById('customerPhone');
        if (customerPhone) {
            customerPhone.addEventListener('input', (e) => this.applyPhoneMask(e.target));
        }

        const addressZipCode = document.getElementById('addressZipCode');
        if (addressZipCode) {
            addressZipCode.addEventListener('input', (e) => this.applyZipCodeMask(e.target));
        }
    }
}