
export class ProductManager {
    constructor(callbacks) {
        this.onAddToCart = callbacks.onAddToCart;
        this.products = [];
        this.categories = [];
        this.currentCategory = 'todos';
        this.searchTerm = '';
    }

    async init() {
        await this.loadCategories();
        await this.loadProducts();
        this.setupEventListeners();
        console.log(this.categories);
    }

    async loadCategories() {
        const grid = document.getElementById('gridCategories');
        if (!grid) return;

        try {
            const categories = await window.ElectronAPI.getCategories();
            this.categories = categories;

            // Keep "Todos" button and append others
            const allBtn = grid.querySelector('[data-category="todos"]');
            grid.innerHTML = '';
            if (allBtn) grid.appendChild(allBtn);

            categories.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = 'category-btn';
                btn.dataset.category = cat.id_categoria;
                btn.innerHTML = `<i class="fa fa-${cat.icone}"></i> ${cat.nome}`;
                grid.appendChild(btn);
            });
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    }

    async loadProducts(category = this.currentCategory, searchTerm = this.searchTerm) {
        this.currentCategory = category;
        this.searchTerm = searchTerm;

        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        try {
            // Cache products if not already loaded, or reload if needed. 
            // For now, let's assume valid data or simple re-fetch. 
            // Optimization: Fetch once and filter locally? The original code fetched every time. 
            // Let's optimize: Fetch once on init, then filter.
            if (this.products.length === 0) {
                this.products = await window.ElectronAPI.getProducts();
            }

            const filtered = this.products.filter(p => {
                const matchesCategory = category === 'todos' || p.categoria_id === parseInt(category);
                const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.descricao.toLowerCase().includes(searchTerm.toLowerCase());
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
                card.onclick = () => {
                    if (this.onAddToCart) this.onAddToCart(product);
                };
                grid.appendChild(card);
            });
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            grid.innerHTML = '<p style="color: var(--danger);">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
        }
    }

    setupEventListeners() {
        // Category Click Delegation (parent is static, buttons are dynamic)
        const categoryGrid = document.getElementById('gridCategories');
        if (categoryGrid) {
            categoryGrid.addEventListener('click', (e) => {
                const btn = e.target.closest('.category-btn');
                if (btn) {
                    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.loadProducts(btn.dataset.category);
                }
            });
        }

        // Search Listener
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.loadProducts(this.currentCategory, e.target.value);
            });
        }
    }
}
