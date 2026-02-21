# 🍔 Tadalas Burguer - Desktop

Sistema de Ponto de Venda (PDV) desktop para hamburgueria artesanal, desenvolvido com **Electron**, **Vite** e **SQLite**.


Version 1.0

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Banco de Dados](#-banco-de-dados)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [API e Sincronização](#-api-e-sincronização)
- [Segurança](#-segurança)

---

## 📖 Sobre o Projeto

O **Tadalas Burguer Desktop** é um sistema completo de PDV (Ponto de Venda) desenvolvido para gerenciar vendas de uma hamburgueria artesanal. O aplicativo funciona de forma **offline-first**, armazenando dados localmente em SQLite e sincronizando automaticamente com um servidor backend quando há conexão com a internet.

### Principais Características:
- Interface moderna e responsiva com tema escuro
- Funciona 100% offline com sincronização automática
- Sistema de autenticação seguro com bcrypt
- Gerenciamento completo de pedidos, produtos e clientes
- Suporte a diferentes tipos de pedido: local, entrega e retirada
- Múltiplos métodos de pagamento

---

## ✨ Funcionalidades

### Sistema de Login
- Autenticação de funcionários com email e senha
- Senhas criptografadas com bcrypt
- Recuperação de senha por email

### PDV (Ponto de Venda)
- Catálogo de produtos com categorias
- Carrinho de compras interativo
- Busca e filtro de produtos
- Cálculo automático de totais

### Gerenciamento de Pedidos
- Pedidos para consumo local
- Pedidos para entrega com gestão de endereços
- Pedidos para retirada
- Integração com API de CEP (ViaCEP)

### Gestão de Clientes
- Cadastro de novos clientes
- Busca de clientes existentes
- Histórico de pedidos por cliente
- Gerenciamento de endereços

### Métodos de Pagamento
- Dinheiro (com cálculo de troco)
- Cartão de crédito/débito
- PIX
- Outros métodos configuráveis

---

## 🛠 Tecnologias Utilizadas

### Frontend (Renderer)
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Vite** | 7.3.1 | Build tool e dev server |
| **SweetAlert2** | 11.26.18 | Notificações e modais interativos |
| **Font Awesome** | - | Ícones |
| **CSS3** | - | Estilização com tema escuro |

### Backend (Main Process)
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Electron** | 39.2.4 | Framework desktop |
| **better-sqlite3** | 12.5.0 | Banco de dados SQLite |
| **bcryptjs** | 3.0.3 | Criptografia de senhas |

### Build & Deploy
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **electron-builder** | 26.8.1 | Empacotamento para distribuição |
| **concurrently** | 9.2.1 | Execução paralela de scripts |

---

## 🏗 Arquitetura

O projeto segue o padrão **MVC (Model-View-Controller)** adaptado para a arquitetura de processos do Electron:

```
┌─────────────────────────────────────────────────────────────┐
│                    RENDERER PROCESS                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Views     │  │  Services   │  │      Assets         │ │
│  │  (Login,    │  │  (Rotas,    │  │  (CSS, Icons)       │ │
│  │   PDV)      │  │ Notificação)│  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │ IPC (contextBridge)
┌─────────────────────────┴───────────────────────────────────┐
│                     MAIN PROCESS                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Controllers │  │   Models    │  │     Services        │ │
│  │             │──│             │──│  (APIFetch,         │ │
│  │             │  │             │  │   SessionManager)   │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                          │                                  │
│                  ┌───────┴───────┐                         │
│                  │   Database    │                         │
│                  │   (SQLite)    │                         │
│                  └───────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### Comunicação entre Processos (IPC)

O `preload.js` expõe a API `ElectronAPI` para comunicação segura:

```javascript
// Métodos disponíveis no renderer
window.ElectronAPI.getProducts()      // Buscar produtos
window.ElectronAPI.getCategories()    // Buscar categorias
window.ElectronAPI.getUserData()      // Buscar usuários
window.ElectronAPI.confirmOrder()     // Confirmar pedido
window.ElectronAPI.checkLogin()       // Validar login
window.ElectronAPI.getCEPaddress()    // Buscar endereço por CEP
```

---

## 📁 Estrutura de Pastas

```
Tadalas_Burguer-DESKTOP/
├── src/
│   ├── main.js                    # Processo principal Electron
│   ├── preload.js                 # Bridge de comunicação IPC
│   ├── renderer.js                # Inicialização do frontend
│   ├── index.css                  # Estilos globais
│   │
│   ├── assets/
│   │   └── icon/                  # Ícones do aplicativo
│   │
│   ├── Main_back/                 # Backend (Main Process)
│   │   ├── Controllers/           # Controladores de negócio
│   │   │   ├── CategoriasController.js
│   │   │   ├── DominioController.js
│   │   │   ├── EnderecosController.js
│   │   │   ├── ItemPedidosController.js
│   │   │   ├── LoginController.js
│   │   │   ├── PagamentosController.js
│   │   │   ├── PedidosController.js
│   │   │   ├── ProdutosController.js
│   │   │   └── UsuariosController.js
│   │   │
│   │   ├── Database/
│   │   │   └── db.js              # Configuração SQLite
│   │   │
│   │   ├── Models/                # Modelos de dados
│   │   │   ├── Categorias.js
│   │   │   ├── Dominio.js
│   │   │   ├── Enderecos.js
│   │   │   ├── ItensPedidos.js
│   │   │   ├── Pagamentos.js
│   │   │   ├── Pedidos.js
│   │   │   ├── Produtos.js
│   │   │   └── Usuarios.js
│   │   │
│   │   └── Services/
│   │       ├── APIFetch.js        # Sincronização com API
│   │       └── SessionManager.js  # Gerenciamento de sessão
│   │
│   └── Renderer_front/            # Frontend (Renderer Process)
│       ├── assets/
│       │   ├── css/               # Estilos
│       │   │   ├── style.css      # Estilos principais
│       │   │   ├── paginaLogin/   # Estilos do login
│       │   │   ├── paginaPDV/     # Estilos do PDV
│       │   │   └── importacaoDeFora/
│       │   └── icon/
│       │
│       ├── Services/
│       │   ├── Notificacao.js     # Sistema de alertas
│       │   └── Rotas.js           # Roteamento SPA
│       │
│       └── Views/
│           ├── Login/             # Tela de login
│           │   ├── Login.js
│           │   └── Botoes/
│           │       └── EsqueciSenha.js
│           │
│           ├── PDV/               # Sistema de vendas
│           │   ├── PDV.js
│           │   └── function/
│           │       ├── PDV.cart.js
│           │       ├── PDV.checkout.js
│           │       ├── PDV.layout.js
│           │       ├── PDV.products.js
│           │       └── PDV.utils.js
│           │
│           ├── Produto/           # Gestão de produtos
│           │   ├── ProdutosView.js
│           │   ├── form/
│           │   └── listar/
│           │
│           └── Usuario/           # Gestão de usuários
│               └── UsuarioView.js
│
├── index.html                     # HTML principal
├── package.json                   # Dependências e scripts
├── vite.config.js                 # Configuração do Vite
├── vite.main.config.mjs           # Config Vite para main
├── vite.preload.config.mjs        # Config Vite para preload
├── vite.renderer.config.mjs       # Config Vite para renderer
└── forge.config.js                # Configuração Electron Forge
```

---

## 🗄 Banco de Dados

O sistema utiliza **SQLite** com **better-sqlite3** para armazenamento local. O banco é criado automaticamente em `%APPDATA%/Desk/tadalas.db`.

### Diagrama Entidade-Relacionamento

```
┌─────────────────────┐     ┌─────────────────────┐
│  dom_tipo_usuario   │     │   dom_tipo_pedido   │
│─────────────────────│     │─────────────────────│
│ id (PK)             │     │ id (PK)             │
│ uuid                │     │ uuid                │
│ descricao           │     │ descricao_tipo      │
└─────────────────────┘     └─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│ dom_status_pedido   │     │ dom_status_pagamento│
│─────────────────────│     │─────────────────────│
│ id (PK)             │     │ id (PK)             │
│ uuid                │     │ uuid                │
│ descricao           │     │ descricao           │
└─────────────────────┘     └─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│ dom_metodo_pagamento│     │    tbl_categoria    │
│─────────────────────│     │─────────────────────│
│ id (PK)             │     │ id_categoria (PK)   │
│ uuid                │     │ uuid                │
│ descricao_metodo    │     │ nome                │
└─────────────────────┘     │ descricao           │
                            └─────────────────────┘
                                      │
                                      │ 1:N
                                      ▼
┌─────────────────────┐     ┌─────────────────────┐
│    tbl_usuarios     │     │    tbl_produtos     │
│─────────────────────│     │─────────────────────│
│ usuario_id (PK)     │     │ produto_id (PK)     │
│ uuid                │     │ uuid                │
│ nome                │     │ nome                │
│ email               │     │ descricao           │
│ senha (bcrypt)      │     │ preco               │
│ telefone            │     │ estoque             │
│ tipo_usuario_id(FK) │     │ categoria_id (FK)   │
│ sincronizado_em     │     │ foto_produto        │
└─────────────────────┘     │ sincronizado_em     │
         │                  └─────────────────────┘
         │ 1:N                        │
         ▼                            │
┌─────────────────────┐               │
│    tbl_enderecos    │               │
│─────────────────────│               │
│ endereco_id (PK)    │               │
│ uuid                │               │
│ usuario_id (FK)     │               │
│ rua, numero, bairro │               │
│ cidade, estado, cep │               │
│ sincronizado_em     │               │
└─────────────────────┘               │
         │                            │
         │ 1:N                        │
         ▼                            │
┌─────────────────────┐               │
│     tbl_pedidos     │               │
│─────────────────────│               │
│ pedido_id (PK)      │               │
│ uuid                │               │
│ usuario_id (FK)     │               │
│ status_pedido_id(FK)│               │
│ tipo_pedido (FK)    │               │
│ sincronizado_em     │               │
└─────────────────────┘               │
         │                            │
         │ 1:N                        │
         ▼                            │
┌─────────────────────┐               │
│  tbl_itens_pedidos  │◄──────────────┘
│─────────────────────│
│ item_id (PK)        │
│ uuid                │
│ pedido_id (FK)      │
│ produto_id (FK)     │
│ quantidade          │
│ valor_unitario      │
│ sincronizado_em     │
└─────────────────────┘
         │
         │ N:1
         ▼
┌─────────────────────┐
│    tbl_pagamento    │
│─────────────────────│
│ pagamento_id (PK)   │
│ uuid                │
│ pedido_id (FK)      │
│ metodo (FK)         │
│ status_pagamento(FK)│
│ valor_total         │
│ sincronizado_em     │
└─────────────────────┘
```

### Campos de Controle

Todas as tabelas incluem campos para controle de sincronização:
- `criado_em` - Data de criação
- `atualizado_em` - Data da última atualização
- `excluido_em` - Soft delete (exclusão lógica)
- `sincronizado_em` - Flag de sincronização (0 = pendente, 1 = sincronizado)

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- **Python** (para compilar better-sqlite3)
- **Visual Studio Build Tools** (Windows)

### Passos de Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/tadalas-burguer-desktop.git
cd tadalas-burguer-desktop

# 2. Instale as dependências
npm install

# 3. Inicie em modo desenvolvimento
npm run dev
```

### Configuração do Backend (API)

O aplicativo sincroniza com um servidor backend. Configure a URL base em `src/Main_back/Services/APIFetch.js`:

```javascript
this.urlBase = `http://localhost:8000/backend/desktop/api`
this.chave = 'sua-chave-api-aqui'
```

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o app em modo desenvolvimento com hot-reload |
| `npm run build` | Compila os assets para produção |
| `npm run dist` | Gera o instalador para todas as plataformas |
| `npm run dist:win` | Gera o instalador apenas para Windows (.exe) |

### Modo Desenvolvimento

```bash
npm run dev
```

Inicia simultaneamente:
- Vite dev server (http://localhost:5173)
- Electron com DevTools aberto

### Build de Produção

```bash
npm run dist:win
```

Gera um instalador `.exe` na pasta `release/` com configurações NSIS.

---

## 🔄 API e Sincronização

### Sincronização Automática

O sistema sincroniza automaticamente a cada **1 minuto** quando online:

```javascript
// Intervalo de sincronização (60 segundos)
const INTERVALO_SYNC = 1000 * 60 * 1;
```

### Endpoints Sincronizados

| Endpoint | Descrição |
|----------|-----------|
| `/dominioStatusPedido` | Status de pedidos |
| `/dominioTipoUsuario` | Tipos de usuário |
| `/dominioTipoPedido` | Tipos de pedido |
| `/dominioStatusPagamento` | Status de pagamento |
| `/dominioMetodoPagamento` | Métodos de pagamento |
| `/categorias` | Categorias de produtos |
| `/produtos` | Catálogo de produtos |
| `/usuarios` | Usuários do sistema |
| `/pedidos` | Pedidos realizados |
| `/enderecos` | Endereços de entrega |

### Fluxo de Sincronização

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   API REST   │ ───► │   APIFetch   │ ───► │   SQLite     │
│   (Backend)  │ ◄─── │   Service    │ ◄─── │   (Local)    │
└──────────────┘      └──────────────┘      └──────────────┘
     GET/POST              Sync               CRUD Local
```

---

## 🔐 Segurança

### Práticas Implementadas

1. **Context Isolation**: Habilitado para isolar o processo renderer
2. **Node Integration**: Desabilitado no renderer
3. **Preload Scripts**: Comunicação segura via contextBridge
4. **Bcrypt**: Senhas hasheadas com bcryptjs
5. **API Key**: Autenticação Bearer Token com a API

### Configuração de Segurança no Electron

```javascript
webPreferences: {
  preload: path.join(__dirname, 'preload.js'),
  contextIsolation: true,     // ✅ Ativado
  nodeIntegration: false      // ✅ Desativado
}
```

---

## 🎨 Interface do Usuário

### Tema Escuro
- Background principal: `#121212`
- Cards e containers: `#1e1e1e`
- Acentos: Laranja/Dourado

### Componentes Personalizados
- Barra de título customizada (sem frame nativo)
- Botões de controle da janela (minimizar, maximizar, fechar)
- Sistema de notificações com SweetAlert2

---

## 📄 Licença

Este projeto é proprietário e de uso exclusivo do Tadalas Burguer.

---

## 👥 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para Tadalas Burguer**
