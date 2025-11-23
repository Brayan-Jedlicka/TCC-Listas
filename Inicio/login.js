import { auth } from './firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  const form = $('loginForm');
  const loginBtn = $('loginBtn');
  const registerBtn = $('registerBtn');
  const errEl = $('error-message');

  function showError(msg){ if(errEl) errEl.textContent = msg || ''; }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      showError('');
      if (loginBtn) loginBtn.disabled = true;

      const email = ($('email')?.value || '').trim();
      const password = ($('password')?.value || '').trim();
      if (!email || !password) {
        showError('Preencha e-mail e senha.');
        if (loginBtn) loginBtn.disabled = false;
        return;
      }

      try {
        console.log('Tentando login', email);
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Login OK -> redirecionando');
        window.location.href = 'dashboard.html';
      } catch (err) {
        console.error('login error', err);
        const code = err?.code || '';
        if (code.includes('invalid-api-key') || code.includes('api-key-not-valid')) {
          showError('Configuração do Firebase incorreta (apiKey).');
        } else if (code.includes('wrong-password')) showError('Senha incorreta.');
        else if (code.includes('user-not-found')) showError('Usuário não encontrado.');
        else showError(err?.message || code);
      } finally {
        if (loginBtn) loginBtn.disabled = false;
      }
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', async () => {
      showError('');
      registerBtn.disabled = true;
      const email = ($('email')?.value || '').trim();
      const password = ($('password')?.value || '').trim();
      if (!email || !password) { showError('Preencha e-mail e senha.'); registerBtn.disabled = false; return; }
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        window.location.href = 'dashboard.html';
      } catch (err) {
        console.error('register error', err);
        showError(err?.message || err?.code || 'Erro ao cadastrar.');
      } finally { registerBtn.disabled = false; }
    });
  }
});
