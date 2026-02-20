
import { Utils } from './PDV.utils.js';
import Notificacao from '../../../Services/Notificacao.js';

export class CheckoutManager {
    constructor(callbacks) {
        this.callbacks = callbacks; // e.g. onConfirmOrder
        this.orderType = '1'; // 'local', 'entrega', 'retirada'
        this.selectedPaymentMethod = '5';
        this.selectedCustomer = null;
        this.deliveryFee = 5.00;
        this.customers = [];
        this.address = [];
        this.cart = []; // Will be set when opening modal
        this.notification = new Notificacao
    }

    async init() {
        await this.loadCustomers();
        await this.loadAdress();
        this.setupEventListeners();
    }

    async loadAdress(){
        try {
            this.address = await window.ElectronAPI.getAdressData();
        } catch (error) {
            console.error("Erro ao carregar endereços:", error);
            this.address = [];
        }

    }

    async loadCustomers() {
        try {
            const users = await window.ElectronAPI.getUserData();
            this.customers = users.filter(user => user.tipo_usuario_id == 3);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            this.customers = [];
        }
    }

    openModal(cartItems) {
        this.cart = cartItems;
        const paymentModal = document.getElementById('paymentModal');

        // Reset state
        this.orderType = '1';
        this.selectedPaymentMethod = '5';
        this.selectedCustomer = null;

        // Reset UI
        this.updateModalTotal();
        this.resetForms();
        this.updateUIForOrderType();

        if (paymentModal) paymentModal.classList.add('active');
    }

    closeModal() {
        const paymentModal = document.getElementById('paymentModal');
        if (paymentModal) paymentModal.classList.remove('active');
    }

    resetForms() {
        // Clear inputs
        const fields = ['receivedAmount', 'customerName', 'customerPhone','customerPassword','customerConfirmPassword', 'addressStreet',"addressID",
            'addressNumber', 'addressComplement', 'addressNeighborhood','addressID',
            'addressZipCode', 'addressReference', 'orderNotes', 'customerSearchInput'];

        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });

        // Reset display elements
        const changeAmount = document.getElementById('changeAmount');
        if (changeAmount) changeAmount.textContent = 'R$ 0,00';

        // Reset UI visibility
        document.getElementById('customerSearchBox').style.display = 'none';
        document.getElementById('newCustomerForm').style.display = 'none';
        document.getElementById('selectedCustomerDisplay').style.display = 'none';

        // Reset validation classes/styles if any
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));

        // Set defaults
        const defaultOrderType = document.querySelector('[data-order-type="local"]');
        if (defaultOrderType) defaultOrderType.classList.add('selected');

        const defaultPayment = document.querySelector('[data-method="dinheiro"]');
        if (defaultPayment) defaultPayment.classList.add('selected');

        document.getElementById('cashPayment').style.display = 'block';
    }

    setOrderType(type) {
        this.orderType = type;
        this.updateUIForOrderType();
        this.updateModalTotal();
    }

    updateUIForOrderType() {
        const deliveryAddressSection = document.getElementById('deliveryAddressSection');

        if (deliveryAddressSection) {
            deliveryAddressSection.style.display = this.orderType === '3' ? 'block' : 'none';
        }

        // Clear customer selection on type change (optional, but keeps it clean)
        this.clearSelectedCustomer(); 
    }

    updateModalTotal() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
        const fee = this.orderType === '3' ? this.deliveryFee : 0;
        const total = subtotal + fee;

        const modalTotal = document.getElementById('modalTotal');
        const deliveryFeeEl = document.getElementById('deliveryFee');

        if (modalTotal) modalTotal.textContent = Utils.formatCurrency(total); // Using helper
        if (deliveryFeeEl) deliveryFeeEl.textContent = Utils.formatCurrency(this.deliveryFee);
    }

    // ==================== CUSTOMER LOGIC ====================
    async searchCustomers(searchTerm) {
        if (!searchTerm || !searchTerm.trim()) return [];

        const term = searchTerm.toLowerCase().trim();
        const searchClean = term.replace(/\D/g, '');

        return this.customers.filter(customer => {
            const matchName = customer.nome && customer.nome.toLowerCase().includes(term);
            const phoneClean = customer.telefone ? customer.telefone.replace(/\D/g, '') : '';
            const matchPhone = searchClean.length > 0 && phoneClean.includes(searchClean);
            const matchEmail = customer.email && customer.email.toLowerCase().includes(term);
            return matchName || matchPhone || matchEmail;
        });
    }

    displayCustomerSearchResults(results) {
        const resultsDiv = document.getElementById('customerSearchResults');
        if (!resultsDiv) return;

        resultsDiv.innerHTML = '';

        if (results.length === 0) {
            resultsDiv.innerHTML = '<div class="no-results">Nenhum cliente encontrado</div>';
            return;
        }

        results.forEach(customer => {
            const el = document.createElement('div');
            el.className = 'customer-result-card';
            el.innerHTML = `
                <div class="customer-result-info">
                    <div class="customer-result-name">${customer.nome}</div>
                    <div class="customer-result-phone">${customer.telefone}</div>
                </div>
                <button class="btn btn-sm btn-primary">Selecionar</button>
            `;
            el.querySelector('button').onclick = () => this.selectCustomer(customer);
            resultsDiv.appendChild(el);
        });
    }

    selectCustomer(customer) {
        this.selectedCustomer = customer;

        const displayDiv = document.getElementById('selectedCustomerDisplay');
        const nameEl = document.getElementById('selectedCustomerName');

        if (nameEl) nameEl.textContent = customer.nome;

        if (displayDiv) displayDiv.style.display = 'block';
        document.getElementById('customerSearchBox').style.display = 'none';
        document.getElementById('newCustomerForm').style.display = 'none';

        // Auto-fill address if available and order type is delivery
        if (this.orderType === '3') {
        const userAddress = this.address.find(add => add.usuario_id === customer.usuario_id) ?? '';
                this.autoFillAddress(userAddress)
        }   



    }
    autoFillAddress(addressData){
        const cep = Utils.applyZipCodeMask({value: addressData.cep || addressData.dados.cep || ''});

        document.getElementById('addressID').value = addressData.endereco_id || '';
                document.getElementById('addressStreet').value = addressData.rua || addressData.dados.logradouro || '';
                document.getElementById('addressNumber').value = addressData.numero || '';
                document.getElementById('addressNeighborhood').value = addressData.bairro || addressData.dados.bairro || '';
                document.getElementById('addressZipCode').value = cep;
                document.getElementById('addressComplement').value = addressData.complemento || '';
    }

    clearSelectedCustomer() {
        this.selectedCustomer = null;
        document.getElementById('selectedCustomerDisplay').style.display = 'none';
    }

    // ==================== VALIDATION & CONFIRMATION ====================
    validateOrder() {
        if (this.orderType === '1') return true;


        // Check Address for Delivery
        if (this.orderType === '3') {
            const street = document.getElementById('addressStreet')?.value.trim();
            const number = document.getElementById('addressNumber')?.value.trim();
            const neighborhood = document.getElementById('addressNeighborhood')?.value.trim();

            if (!street || !number || !neighborhood) {
                this.notification.notificacaoMensagem('error','Por favor, preencha o endereço de entrega completo.');
                return false
            }
        }
        return true;
    }


    getOrderData() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
        const fee = this.orderType === '3' ? this.deliveryFee : 0;

        const data = {
            orderType: this.orderType,
            paymentMethod: this.selectedPaymentMethod,
            items: this.cart,
            subtotal: subtotal,
            deliveryFee: fee,
            total: subtotal + fee,
            notes: document.getElementById('orderNotes')?.value || '',
        };

        // Customer Info
        if (this.selectedCustomer) {
            data.customer = { ...this.selectedCustomer, isExisting: true };
        } else {
            const phoneClean = document.getElementById('customerPhone')?.value?.replace(/\D/g, '');
            const birthDate = document.getElementById('customerPassword')?.value;
            const firstPassword = birthDate.replace(/\D/g, ''); 
            data.customer = {
            name: document.getElementById('customerName')?.value || '',
            phone: phoneClean,
            password: firstPassword,
            DateOfBirth: birthDate,
            isExisting: false
            };
        }

        // Address Info
        if (this.orderType === '3') {
            const addressID = document.getElementById('addressID')?.value;
            data.address = {
                endereco_id: addressID || null,
                street: document.getElementById('addressStreet')?.value,
                number: document.getElementById('addressNumber')?.value,
                neighborhood: document.getElementById('addressNeighborhood')?.value,
                zipCode: document.getElementById('addressZipCode')?.value,
                complement: document.getElementById('addressComplement')?.value,
                reference: document.getElementById('addressReference')?.value
            };
        }

        return data;
}

    // ==================== LISTENERS ====================
    setupEventListeners() {
        const self = this;

        // Close Modal
        document.querySelectorAll('.btn-close-modal, #cancelPaymentBtn').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Confirm Payment
        document.getElementById('confirmPaymentBtn')?.addEventListener('click', () => {
            if (this.validateOrder()) {
                if (this.callbacks.onConfirmOrder) {
                    this.callbacks.onConfirmOrder(this.getOrderData());
                }
            }
        });


        // Order Type Selection
        document.querySelectorAll('[data-order-type]').forEach(el => {
            el.addEventListener('click', () => {
                document.querySelectorAll('[data-order-type]').forEach(x => x.classList.remove('selected'));
                el.classList.add('selected');
                this.setOrderType(el.dataset.orderid);
            });
        });

        // Payment Method Selection
        document.querySelectorAll('[data-method]').forEach(el => {
            el.addEventListener('click', () => {
                document.querySelectorAll('[data-method]').forEach(x => x.classList.remove('selected'));
                el.classList.add('selected');
                this.selectedPaymentMethod = el.dataset.methodid;

                const cashPayment = document.getElementById('cashPayment');
                if (cashPayment) cashPayment.style.display = this.selectedPaymentMethod === '5' ? 'block' : 'none';
            });
        });

        // Customer Search
        const searchInput = document.getElementById('customerSearchInput');
        if (searchInput) {
            let timeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(async () => {
                    const results = await this.searchCustomers(e.target.value); // Wait for results
                    this.displayCustomerSearchResults(results);
                }, 300);
            });
        }


        




        document.getElementById('searchExistingCustomerBtn')?.addEventListener('click', () => {
            document.getElementById('customerSearchBox').style.display = 'block';
            document.getElementById('newCustomerForm').style.display = 'none';
            document.getElementById('customerSearchInput').focus();
        });

        document.getElementById('newCustomerBtn')?.addEventListener('click', () => {
            this.selectedCustomer = null;
            document.getElementById('selectedCustomerDisplay').style.display = 'none';
            document.getElementById('customerSearchBox').style.display = 'none';
            document.getElementById('newCustomerForm').style.display = 'block';
        });

        document.getElementById('clearCustomerBtn')?.addEventListener('click', () => this.clearSelectedCustomer());

        // Cash Change Calculation
        document.getElementById('receivedAmount')?.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            const subtotal = this.cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
            const fee = this.orderType === '3' ? this.deliveryFee : 0;
            const total = subtotal + fee;
            const change = value - total;

            const changeEl = document.getElementById('changeAmount');
            if (changeEl) changeEl.textContent = `R$ ${change > 0 ? change.toFixed(2) : '0,00'}`;
        });

        // Masks
        document.getElementById('customerPhone')?.addEventListener('input', (e) => Utils.applyPhoneMask(e.target));
        document.getElementById('addressZipCode')?.addEventListener('input', async (e) => {
            const cepiNPUT = Utils.applyZipCodeMask(e.target);
            if(cepiNPUT.length === 9){
                const addresCEP = await window.ElectronAPI.getCEPaddress(cepiNPUT);
                this.autoFillAddress(addresCEP)
            }
        });
    }
}
