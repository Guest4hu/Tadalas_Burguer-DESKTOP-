
export const Layout = {
    render() {
        const employeeData = JSON.parse(sessionStorage.getItem('employeeData'));
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
                            <span>Operador: ${employeeData.nome}</span>
                            <input type="hidden" id="employeeID" value="${employeeData.id}">
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
                            <div class="order-type-option selected" data-order-type="local" data-orderID="1">
                                <i class='fa fa-hand-o-down'></i>
                                <span>Local</span>
                            </div>
                            <div class="order-type-option" data-order-type="retirada" data-orderID="2">
                                <i class="fa fa-shopping-bag"></i>
                                <span>Retirada</span>
                            </div>
                            <div class="order-type-option" data-order-type="entrega" data-orderID="3">
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
                            <input type="text" class="input-compact" id="customerSearchInput" placeholder="Nome ou telefone e email...">
                            <div id="customerSearchResults" class="search-results-compact"></div>
                        </div>

                        <!-- New Customer Form Compact -->
                        <div id="newCustomerForm" style="display: none;">
                            <input type="text" class="input-compact" id="customerName" placeholder="Nome completo">
                            <input type="tel" class="input-compact" id="customerPhone" placeholder="Telefone do Usuario">
                            <input type="date" class="input-compact" id="customerPassword" placeholder="Data de nascimento" max="4">
                        </div>
                    </div>

                    <!-- Delivery Address - Compact -->
                    <div id="deliveryAddressSection" class="form-section" style="display: none;">
                        <label class="section-label">
                            <i class="fa fa-map-marker"></i> Endereço de Entrega
                        </label>
                        <div class="address-compact-grid">
                            <input type="hidden" id="addressID">
                            <input type="text" class="input-compact" id="addressZipCode" placeholder="CEP">
                            <input type="text" class="input-compact" id="addressStreet" placeholder="Rua" style="grid-column: 1 / 3;">
                            <input type="text" class="input-compact" id="addressNumber" placeholder="Nº">
                            <input type="text" class="input-compact" id="addressNeighborhood" placeholder="Bairro">
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
                            <div class="payment-option selected" data-method="dinheiro" data-methodID="5">
                                <i class="fa fa-money"></i>
                                <span>Dinheiro</span>
                            </div>
                            <div class="payment-option" data-method="pix" data-methodID="1">
                                <i class="fa fa-qrcode"></i>
                                <span>PIX</span>
                            </div>
                            <div class="payment-option" data-method="debito" data-methodID="3">
                                <i class="fa fa-credit-card"></i>
                                <span>Débito</span>
                            </div>
                            <div class="payment-option" data-method="credito" data-methodID="2">
                                <i class="fa fa-credit-card-alt"></i>
                                <span>Crédito</span>
                            </div>
                            <div class="payment-option" data-method="beneficios" data-methodID="4">
                                <i class="fa fa-credit-card-alt"></i>
                                <span>Benefícios</span>
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
};
