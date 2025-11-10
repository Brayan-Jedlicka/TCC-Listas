import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  runTransaction
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { setupThemeSelector } from './theme.js';

const firebaseConfig = {
  apiKey: "AIzaSyD8OQuwipCvBS2-sJhaq_p49-TeTOLl1Fs",
  authDomain: "tcc-sobre-listas.firebaseapp.com",
  projectId: "tcc-sobre-listas",
  storageBucket: "tcc-sobre-listas.appspot.com",
  messagingSenderId: "620870328306",
  appId: "1:620870328306:web:9aa782e719265dd917556b",
  measurementId: "G-5P0Z9N8CTY"
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const logoutButton = document.getElementById('logoutButton');
const listTypeSelector = document.getElementById('listTypeSelector');
const newListTitle = document.getElementById('newListTitle');
const addListBtn = document.getElementById('addListBtn');
const listsContainer = document.getElementById('listsContainer');
const errorMessage = document.getElementById('error-message');

let userDocRef = null;
let unsubscribe = null;

const MAX_TITLE_LEN = 120;
const MAX_ITEM_LEN = 400;

function showError(msg){ if (!errorMessage) return; errorMessage.textContent = msg; setTimeout(()=>{ if (errorMessage) errorMessage.textContent=''; },3500); }
function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function sanitizeTitle(s){ return (s||'').toString().trim().slice(0, MAX_TITLE_LEN); }
function sanitizeItem(s){ return (s||'').toString().trim().slice(0, MAX_ITEM_LEN); }

function baseListForType(type='generic'){
  switch(type){
    case 'tasks': return { type:'tasks', items:[] };
    case 'ideas': return { type:'ideas', items:[] };
    case 'shopping': return { type:'shopping', items:[] };
    case 'goals': return { type:'goals', items:[] };
    default: return { type:'generic', items:[] };
  }
}

async function ensureUserDoc(uid, email){
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { email: email || null, lists: [] });
  }
  return ref;
}

async function createList(title, type='generic'){
  if (!userDocRef) throw new Error('not_authenticated');
  const safeTitle = sanitizeTitle(title) || 'Lista sem título';
  const base = baseListForType(type);
  return runTransaction(db, async (tx)=>{
    const snap = await tx.get(userDocRef);
    const lists = (snap.exists() && snap.data().lists) ? snap.data().lists.slice() : [];
    const newList = { id: Date.now().toString(), title: safeTitle, type: base.type, items: base.items };
    lists.push(newList);
    tx.set(userDocRef, { lists }, { merge: true });
    return newList;
  });
}

async function deleteList(listId){
  if (!userDocRef) throw new Error('not_authenticated');
  return runTransaction(db, async (tx)=>{
    const snap = await tx.get(userDocRef);
    const lists = (snap.exists() && snap.data().lists) ? snap.data().lists.filter(l=>l.id!==listId) : [];
    tx.set(userDocRef, { lists }, { merge: true });
  });
}

async function updateListTitle(listId, title){
  if (!userDocRef) throw new Error('not_authenticated');
  const safe = sanitizeTitle(title);
  return runTransaction(db, async (tx)=>{
    const snap = await tx.get(userDocRef);
    const lists = (snap.exists() && snap.data().lists) ? snap.data().lists.map(l=> l.id===listId ? { ...l, title: safe } : l) : [];
    tx.set(userDocRef, { lists }, { merge: true });
  });
}

async function addItem(listId, itemText){
  if (!userDocRef) throw new Error('not_authenticated');
  const safe = sanitizeItem(itemText);
  return runTransaction(db, async (tx)=>{
    const snap = await tx.get(userDocRef);
    const lists = (snap.exists() && snap.data().lists) ? snap.data().lists.map(l=>{
      if (l.id===listId){
        let newItem;
        switch(l.type){
          case 'tasks': newItem = { text: safe, done:false }; break;
          case 'ideas': newItem = { text: safe, note: '' }; break;
          case 'shopping': newItem = { text: safe, qty:1 }; break;
          case 'goals': newItem = { text: safe, progress:0 }; break;
          default: newItem = safe;
        }
        return { ...l, items: [...(l.items||[]), newItem] };
      }
      return l;
    }) : [];
    tx.set(userDocRef, { lists }, { merge: true });
  });
}

async function updateListItem(listId, idx, newItem){
  if (!userDocRef) throw new Error('not_authenticated');
  return runTransaction(db, async (tx)=>{
    const snap = await tx.get(userDocRef);
    const lists = (snap.exists() && snap.data().lists) ? snap.data().lists.map(l=>{
      if (l.id===listId){
        const items = (l.items||[]).slice();
        items[idx] = newItem;
        return { ...l, items };
      }
      return l;
    }) : [];
    tx.set(userDocRef, { lists }, { merge: true });
  });
}

async function deleteItem(listId, idx){
  if (!userDocRef) throw new Error('not_authenticated');
  return runTransaction(db, async (tx)=>{
    const snap = await tx.get(userDocRef);
    const lists = (snap.exists() && snap.data().lists) ? snap.data().lists.map(l=>{
      if (l.id===listId){
        const items = (l.items||[]).slice();
        items.splice(idx,1);
        return { ...l, items };
      }
      return l;
    }) : [];
    tx.set(userDocRef, { lists }, { merge: true });
  });
}

function renderLists(lists=[]){
  if (!listsContainer) return;
  listsContainer.innerHTML = '';
  (lists||[]).forEach(list=>{
    const el = document.createElement('div');
    el.className = 'list-card';
    el.dataset.listId = list.id;
    el.innerHTML = `
      <div class="list-header">
        <input class="list-title" value="${escapeHtml(list.title||'')}" />
        <div class="list-type-label" style="margin-left:8px;font-size:0.9rem;color:var(--muted)">${escapeHtml(list.type||'genérica')}</div>
        <button class="delete-list-btn" title="Excluir">Excluir</button>
      </div>
      <div class="list-items"></div>
      <div class="add-item-row">
        <input class="new-item-input" placeholder="Novo item" />
        <button class="add-item-btn">Adicionar</button>
      </div>
    `;
    const itemsEl = el.querySelector('.list-items');

    function renderItems(items){
      itemsEl.innerHTML = '';
      (items||[]).forEach((it, idx)=>{
        const itemEl = document.createElement('div');
        itemEl.className = 'list-item';
        if (list.type==='tasks'){
          const done = it && it.done ? 'checked' : '';
          itemEl.innerHTML = `<label style="display:flex;align-items:center;gap:8px"><input type="checkbox" class="task-checkbox" data-idx="${idx}" ${done}/> <span class="${it && it.done ? 'done' : ''}">${escapeHtml(it.text||'')}</span></label><button class="remove-item-btn" data-idx="${idx}">x</button>`;
        } else if (list.type==='shopping'){
          const qty = it && it.qty != null ? it.qty : 1;
          itemEl.innerHTML = `<span>${escapeHtml(it.text||'')}</span><div style="display:flex;gap:8px;align-items:center"><input class="shop-qty" type="number" min="1" value="${qty}" data-idx="${idx}" style="width:64px;padding:6px;border-radius:6px"/><button class="remove-item-btn" data-idx="${idx}">x</button></div>`;
        } else if (list.type==='ideas'){
          itemEl.innerHTML = `<div style="flex:1"><div>${escapeHtml(it.text||'')}</div><div style="font-size:0.85rem;color:var(--muted)">${escapeHtml(it.note||'')}</div></div><button class="remove-item-btn" data-idx="${idx}">x</button>`;
        } else if (list.type==='goals'){
          const progress = it && it.progress != null ? it.progress : 0;
          itemEl.innerHTML = `<div style="flex:1"><div>${escapeHtml(it.text||'')}</div><div style="font-size:0.85rem;color:var(--muted)">Progresso: ${progress}%</div></div><button class="remove-item-btn" data-idx="${idx}">x</button>`;
        } else {
          itemEl.innerHTML = `${escapeHtml(it)} <button class="remove-item-btn" data-idx="${idx}">x</button>`;
        }
        itemsEl.appendChild(itemEl);
      });
    }

    renderItems(list.items);
 
    el.querySelector('.add-item-btn')?.addEventListener('click', async ()=>{
      const input = el.querySelector('.new-item-input');
      const v = input ? sanitizeItem(input.value) : '';
      if (!v) return;
      try { await addItem(list.id, v); if (input) input.value=''; } catch(e){ console.error(e); showError('Falha ao adicionar item'); }
    });

    el.addEventListener('click', async (ev)=>{
      if (ev.target.classList.contains('remove-item-btn')){
        const idx = Number(ev.target.dataset.idx);
        try { await deleteItem(list.id, idx); } catch(e){ console.error(e); showError('Falha ao remover item'); }
      } else if (ev.target.classList.contains('task-checkbox')){
        const idx = Number(ev.target.dataset.idx);
        const checked = ev.target.checked;
        try {
          const snap = await getDoc(userDocRef);
          const listsSnap = (snap.exists() && snap.data().lists) ? snap.data().lists : [];
          const target = listsSnap.find(l=>l.id===list.id);
          const item = (target && target.items) ? target.items[idx] : null;
          const newItem = { ...(item||{}), done: !!checked };
          await updateListItem(list.id, idx, newItem);
        } catch(e){ console.error(e); showError('Erro ao atualizar tarefa'); }
      }
    });

    el.addEventListener('change', async (ev)=>{
      if (ev.target.classList && ev.target.classList.contains('shop-qty')){
        const idx = Number(ev.target.dataset.idx);
        const qty = Number(ev.target.value) || 1;
        try {
          const snap = await getDoc(userDocRef);
          const listsSnap = (snap.exists() && snap.data().lists) ? snap.data().lists : [];
          const target = listsSnap.find(l=>l.id===list.id);
          const item = (target && target.items) ? target.items[idx] : null;
          const newItem = { ...(item||{}), qty };
          await updateListItem(list.id, idx, newItem);
        } catch(e){ console.error(e); showError('Erro ao atualizar quantidade'); }
      }
    });

    el.querySelector('.delete-list-btn')?.addEventListener('click', async ()=>{
      if (!confirm('Excluir esta lista?')) return;
      try { await deleteList(list.id); } catch(e){ console.error(e); showError('Falha ao excluir lista'); }
    });

    el.querySelector('.list-title')?.addEventListener('change', async (ev)=>{
      try { await updateListTitle(list.id, sanitizeTitle(ev.target.value)); } catch(e){ console.error(e); showError('Falha ao salvar título'); }
    });

    listsContainer.appendChild(el);
  });
}

onAuthStateChanged(auth, async (user) => {
  console.log('onAuthStateChanged fired:', user ? { uid: user.uid, email: user.email } : null);
  try { setupThemeSelector(); } catch(e){ /* silent */ }
  if (user){
    try {
      userDocRef = await ensureUserDoc(user.uid, user.email);
      if (unsubscribe) { unsubscribe(); unsubscribe = null; }
      unsubscribe = onSnapshot(userDocRef, snap=>{
        const lists = snap.exists() ? (snap.data().lists||[]) : [];
        renderLists(lists);
      }, err=>{
        console.error(err);
        showError('Erro ao sincronizar listas');
      });
    } catch(e){
      console.error(e);
      showError('Erro ao inicializar dados do usuário');
    }
  } else {
    if (unsubscribe) { unsubscribe(); unsubscribe = null; }
    userDocRef = null;
    if (listsContainer) listsContainer.innerHTML = '';
    if (!location.pathname.endsWith('/index.html') && !location.pathname.endsWith('/')) {
      location.href = './index.html';
    }
  }
});

logoutButton?.addEventListener('click', async (e)=>{
  e.preventDefault();
  try { await signOut(auth); } catch(e){}
});

addListBtn?.addEventListener('click', async () => {
  const title = newListTitle ? sanitizeTitle(newListTitle.value) : '';
  const type = listTypeSelector ? listTypeSelector.value : 'generic';
  if (!title) { showError('Informe um título para a lista'); return; }

  console.log('Criando lista - auth.currentUser:', auth && auth.currentUser ? { uid: auth.currentUser.uid, email: auth.currentUser.email } : null);

  if (!auth || !auth.currentUser) {
    showError('Usuário não autenticado. Faça login novamente.');
    setTimeout(()=> location.href = './index.html', 800);
    return;
  }

  try {
    if (!userDocRef) {
      console.log('userDocRef ausente — tentando ensureUserDoc...');
      userDocRef = await ensureUserDoc(auth.currentUser.uid, auth.currentUser.email);
      console.log('userDocRef agora:', userDocRef && userDocRef.path);
    }
  } catch (err) {
    console.error('Falha ensureUserDoc:', err);
    showError('Erro ao acessar dados do usuário');
    return;
  }

  addListBtn.disabled = true;
  const prev = addListBtn.textContent;
  addListBtn.textContent = 'Criando...';

  try {
    await createList(title, type);
    if (newListTitle) newListTitle.value = '';
    console.log('Lista criada com sucesso');
  } catch (err) {
    console.error('Erro ao criar lista (detalhes):', err);
    showError(`Erro: ${err.code || err.message || 'unknown'}`);
    if (err.code === 'permission-denied') {
      console.warn('Permission denied — verifique firestore.rules e projectId do firebaseConfig');
    }
  } finally {
    addListBtn.disabled = false;
    addListBtn.textContent = prev || 'Criar lista';
  }
});

if (newListTitle) {
  newListTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addListBtn.click();
    }
  });
}
console.log('*** DEBUG: dashboard start ***');
try {
  console.log('firebase config projectId:', (typeof firebase !== 'undefined' && firebase?.app()?.options) ? firebase.app().options.projectId : '(no global firebase)');
} catch(e){ console.log('no global firebase object'); }
console.log('auth object present:', !!auth);
console.log('currentUser (may be null until onAuthStateChanged):', auth && auth.currentUser ? { uid: auth.currentUser.uid, email: auth.currentUser.email } : null);
console.log('userDocRef before init:', userDocRef);