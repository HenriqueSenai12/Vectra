document.addEventListener('DOMContentLoaded', () => {
    // Selecionando os elementos do DOM
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    // Funcionalidade de Mostrar/Ocultar Senha
    if (togglePassword && password) {
        togglePassword.addEventListener('click', function () {
            // Alterna o tipo do input entre 'password' e 'text'
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);

            // Alterna o ícone (olho aberto / olho fechado)
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
});


// Login system with server API
document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const togglePassword = document.getElementById('togglePassword');

  // Toggle password visibility
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.classList.toggle('fa-eye');
      togglePassword.classList.toggle('fa-eye-slash');
    });
  }

  // Login handler
  if (loginBtn && emailInput && passwordInput) {
    loginBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const senha = passwordInput.value.trim();

      if (!email || !senha) {
        alert('Preencha email e senha');
        return;
      }

      try {
const usersResponse = await fetch('/api/users');
        const users = await usersResponse.json();
        const user = users.find(u => u.email === email && u.senha === senha);
        if (user) {
          localStorage.setItem('vectraUser', JSON.stringify({ nome_completo: user.name, funcao: user.role }));
          window.location.href = './Tela principal/painel_Principal.html';
        } else {
          alert('Credenciais inválidas');
        }
      } catch (err) {
        alert('Erro de conexão');
        console.error(err);
      }
    });
  }
});
