import Notificacao from "../../Services/Notificacao.js";
export default class Login {
    constructor(){
        this.notificacao = new Notificacao()
        this.employeeData = [];
    }


    async renderizar(){
         return `<div class="window-chrome">
        <div class="window-controls">
            <div class="window-btn close"></div>
            <div class="window-btn minimize"></div>
            <div class="window-btn maximize"></div>
        </div>
        <div class="window-title">
            <i class="fa fa-cutlery"></i>
            Tadala Burger - Autenticação
        </div>
        <div style="width: 52px;"></div>
    </div>

    <div class="auth-shell">
        <!-- Sidebar -->
        <div class="auth-sidebar">
            <div class="sidebar-content">
                <div class="sidebar-logo">
                    <i class="fa fa-cutlery"></i>
                </div>
                <h1>Tadala Burger</h1>
                <p>Os melhores hambúrgueres artesanais da cidade. Peça agora e receba quentinho em casa!</p>
                
                <div class="feature-list">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fa fa-fire"></i>
                        </div>
                        <span>Hambúrgueres artesanais</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fa fa-truck"></i>
                        </div>
                        <span>Entrega rápida e quentinha</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fa fa-star"></i>
                        </div>
                        <span>Ingredientes selecionados</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fa fa-percent"></i>
                        </div>
                        <span>Promoções exclusivas</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="auth-main">
            <div class="auth-card">
               
                
                
                <!-- Login Form -->
                <h1>Bem-vindo de volta</h1>
                <p class="auth-subtle">Entre com suas credenciais para acessar sua conta e fazer seu pedido no Tadala Burger.</p>
                
                <form id="loginForm">
                    
                    <div class="input-group has-label">
                        <label class="input-label">Email</label>
                        <i class="fa fa-envelope-o input-icon"></i>
                        <input class="w3-input" id="email" name="email" type="email" placeholder="seu@email.com" >
                    </div>
                    
                    <div class="input-group has-label">
                        <label class="input-label">Senha</label>
                        <i class="fa fa-lock input-icon"></i>
                        <input class="w3-input" name="senha" type="password" placeholder="••••••••" >
                    </div>
                    
                    <button type="submit" class="w3-button" style="width:100%;">
                        <i class="fa fa-sign-in" style="margin-right: 8px;"></i>
                        Entrar
                    </button>
                </form>
                
                <div class="links-container">
                    <a href="#EsqueciSenha">Esqueci a senha</a>
                </div>
            </div>
        </div>
        </div>`
    }

    async validarCredenciais(){
        
            const email = document.getElementById('email').value;
            const senha = document.querySelector('input[name="senha"]').value;
            const data = {
                 email: email,
                 senha: senha
                };
                const dados = await window.ElectronAPI.checkLogin(data)
                if (dados.success) {
                    console.log(dados.usuario, "Dados do usuário retornados após validação de credenciais.");
                    const employeeData = dados.usuario;
                    sessionStorage.setItem('nome', JSON.stringify(employeeData.nome));
                    sessionStorage.setItem('usuario_id', JSON.stringify(employeeData.usuario_id));
                    console.log(employeeData, "Dados do funcionário recebidos após login bem-sucedido.");
                    return window.location.href = (`#PDV`);
                } else {                     
                        this.notificacao.notificacaoMensagem('error', "Credenciais inválidas. Por favor, verifique seu email e senha e tente novamente.");
                        return
                  }     
        }
   
    async ativarEventos(){

        // função para o botão de enviar o formulário de login
        const botaoEnviar = document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
           await this.validarCredenciais();
        });

    }
}