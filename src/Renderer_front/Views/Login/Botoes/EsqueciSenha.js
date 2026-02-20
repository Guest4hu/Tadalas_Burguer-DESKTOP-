import Notificacao from "../../../Services/Notificacao.js";
class EsqueciSenha {
    constructor(){
        this.notificacao = new Notificacao()
    }

    async renderizar(){
        return `
          <div class="window-chrome">
        <div class="window-title">
            <i class="fa fa-lock"></i>
            Recuperação de Senha
        </div>
        <div class="window-controls">
            <div class="window-btn close"></div>
            <div class="window-btn minimize"></div>
            <div class="window-btn maximize"></div>
        </div>
    </div>

    <!-- Main Container -->
    <div class="auth-shell">
        <!-- Sidebar -->
        <div class="auth-sidebar">
            <div class="sidebar-content">
                <div class="sidebar-logo">
                    <i class="fa fa-shield"></i>
                </div>
                <h1>Recuperação Segura</h1>
                <p>Siga os passos simples para recuperar o acesso à sua conta de forma rápida e segura.</p>
                
                <div class="feature-list">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fa fa-envelope-o"></i>
                        </div>
                        <span>Código enviado para seu email</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fa fa-clock-o"></i>
                        </div>
                        <span>Processo rápido em 2 passos</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fa fa-lock"></i>
                        </div>
                        <span>100% seguro e criptografado</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="auth-main">
            <div class="auth-card">
                <!-- Passo 1: Solicitar Email -->
                <div id="step1" class="step active">
                    <a href="/login" class="back-link">
                        <i class="fa fa-arrow-left"></i>
                        Voltar para o login
                    </a>
                    
                    <h1>Esqueceu sua senha?</h1>
                    <p class="auth-subtle">Não se preocupe! Digite seu email abaixo e enviaremos um código de verificação para redefinir sua senha.</p>
                    
                    <div class="success-message" id="emailSuccess">
                        <i class="fa fa-check-circle" style="margin-right: 8px;"></i>
                        Código enviado com sucesso! Verifique seu email.
                    </div>
                    
                    <div class="error-message" id="emailError">
                        <i class="fa fa-exclamation-circle" style="margin-right: 8px;"></i>
                        <span id="emailErrorText">Email não encontrado no sistema.</span>
                    </div>
                    
                    <form id="emailForm">
                        <div class="input-group has-label">
                            <label class="input-label">Email cadastrado</label>
                            <i class="fa fa-envelope-o input-icon"></i>
                            <input class="w3-input" id="recoveryEmail" type="email" placeholder="seu@email.com" required>
                        </div>
                        
                        <button type="submit" class="w3-button w3-block" id="sendCodeButton">
                            <i class="fa fa-paper-plane" style="margin-right: 8px;"></i>
                            Enviar Código
                        </button>
                    </form>
                    
                    <div style="margin-top: 32px; text-align: center; font-size: 14px; color: var(--muted);">
                        <p>Lembrou da senha? <a href="#Login">Fazer login</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
    }


    async validaEmail(email) {
        let resultado = await window.ElectronAPI.enviarCodigoRecuperacao(email);
        if (resultado === false){
            this.notificacao.notificacaoMensagem("error", "Email não encontrado no sistema.");
        }
    }

    async ativarEventos(){
        const emailForm = document.getElementById('emailForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const recoveryEmail = document.getElementById('recoveryEmail').value;
            this.validaEmail(recoveryEmail);
        
        })




    }




}

export default EsqueciSenha