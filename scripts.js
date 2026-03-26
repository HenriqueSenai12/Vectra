// scripts.js - Sistema global de avatar do usuário logado para todas as páginas
// Carrega em todas: painel_controle.html, painel_Principal.html, usuarios.html

let loggedUser = localStorage.getItem('loggedUser') ? JSON.parse(localStorage.getItem('loggedUser')) : null;

document.addEventListener('DOMContentLoaded', function() {
  updateAllAvatars();
  
  // Listener global para mudanças no usuário logado
  window.addEventListener('storage', (e) => {
    if (e.key === 'loggedUser') {
      loggedUser = e.newValue ? JSON.parse(e.newValue) : null;
      updateAllAvatars();
    }
  });
});

function updateAllAvatars() {
  // Atualiza todos os avatares da página atual
  const avatars = document.querySelectorAll('#userAvatarHeader, .user-avatar-header');
  avatars.forEach(avatar => updateSingleAvatar(avatar));
}

function updateSingleAvatar(avatar) {
  let user = loggedUser || { name: 'Operador Vectra', role: 'operador' };
  
  const name = user.name || user.nome_completo || user.nome || 'Operador Vectra';
  const isAdmin = (user.role || user.funcao) === 'admin';
  
  const avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${isAdmin ? '4FA3FF' : '1E3A5F'}&color=fff&bold=${isAdmin}`;
  
  avatar.src = avatarSrc;
  avatar.title = `${name} (${isAdmin ? 'Administrador' : 'Operador'})`;
  avatar.alt = `Avatar de ${name}`;
  
  // Efeito visual para diferenciar
  avatar.classList.toggle('border-blue-400/50', isAdmin);
  avatar.classList.toggle('border-slate-400/30', !isAdmin);
}

// Função para login/setar usuário (chamar após autenticação)
function setLoggedUser(user) {
  loggedUser = user;
  localStorage.setItem('loggedUser', JSON.stringify(user));
  updateAllAvatars();
}

// Logout
function logoutUser() {
  loggedUser = null;
  localStorage.removeItem('loggedUser');
  updateAllAvatars();
}

