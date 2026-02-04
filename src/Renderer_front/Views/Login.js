export default class Login {
    constructor(){

    }
    renderizarLogin(){
        return ` <div class="window-chrome">
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
                <!-- Success/Error Messages -->
                <div class="success-message" id="successMessage">
                    Ação realizada com sucesso!
                </div>
                <div class="error-message" id="errorMessage">
                    Ocorreu um erro. Tente novamente.
                </div>
                
                <!-- Login Form -->
                <h1>Bem-vindo de volta</h1>
                <p class="auth-subtle">Entre com suas credenciais para acessar sua conta e fazer seu pedido no Tadala Burger.</p>
                
                <form action="/backend/login" method="POST">
                    <input type="hidden" name="redirect" value="<?php echo htmlspecialchars($redirect ?? '/carrinho.php', ENT_QUOTES, 'UTF-8'); ?>">
                    
                    <div class="input-group has-label">
                        <label class="input-label">Email</label>
                        <i class="fa fa-envelope-o input-icon"></i>
                        <input class="w3-input" name="email" type="email" placeholder="seu@email.com" required>
                    </div>
                    
                    <div class="input-group has-label">
                        <label class="input-label">Senha</label>
                        <i class="fa fa-lock input-icon"></i>
                        <input class="w3-input" name="senha" type="password" placeholder="••••••••" required>
                    </div>
                    
                    <button type="submit" class="w3-button" style="width:100%;">
                        <i class="fa fa-sign-in" style="margin-right: 8px;"></i>
                        Entrar
                    </button>
                </form>
                
                <div class="links-container">
                    <a href="/backend/esqueci-senha">Esqueci a senha</a>
                </div>
                
                <!-- Divider -->
                <div class="divider">
                    <span class="divider-text">ou</span>
                </div>
                
                <!-- Register Button -->
                <a href="#registrarConta" class="w3-button btn-secondary" style="width: 100%;">
                    <i class="fa fa-user-plus" style="margin-right: 8px;"></i>
                    Criar Nova Conta
                </a>
            </div>
        </div>
    </div>
    <!-- Register Modal -->
    <div class="modal-overlay" id="registerModal" onclick="closeRegisterModal(event)">
        <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-close" onclick="closeRegisterModal()">
                <i class="fa fa-times"></i>
            </div>
            
            <div class="modal-header">
                <h2>Criar Nova Conta</h2>
                <p class="auth-subtle" style="margin-bottom: 0;">Cadastre-se agora e aproveite nossas delícias e promoções exclusivas!</p>
            </div>
            
            <form action="/backend/register" method="POST" id="registerForm">
                <input type="hidden" name="redirect" value="<?php echo htmlspecialchars($redirect ?? '/carrinho.php', ENT_QUOTES, 'UTF-8'); ?>">
                
                <div class="input-group has-label">
                    <label class="input-label">Email</label>
                    <i class="fa fa-envelope-o input-icon"></i>
                    <input class="w3-input" name="email" type="email" placeholder="seu@email.com" required>
                </div>
                
                <div class="input-group has-label">
                    <label class="input-label">Senha</label>
                    <i class="fa fa-lock input-icon"></i>
                    <input class="w3-input" name="senha" type="password" placeholder="••••••••" required>
                </div>
                
                <button type="submit" class="w3-button w3-block">
                    <i class="fa fa-user-plus" style="margin-right: 8px;"></i>
                    Registrar
                </button>
            </form>
            
            <div style="margin-top: 20px; text-align: center; font-size: 14px; color: var(--muted);">
                <p>Já tem uma conta? <a href="#" onclick="closeRegisterModal(); return false;">Faça o login</a>.</p>
            </div>
        </div>
    </div>`
    }

    modalRegistrarConta(){
        console.log("Estou ativando malandro")


        document.getElementById('registerModal').classList.add('active');   
    }






    validarCredenciais(usuario, senha){

    

    }


    fecharModal(){



    }

    botaoEsqueciSenha(){


    }

    botaoCriarConta(){


    }

}