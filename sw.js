/* VTS Audit: يخلي الأبليكيشن يفتح من غير نت. الصفحة بتتجدد من النت لما يكون موجود */
const C = 'vts-audit-v1';
const CORE = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  /* Firestore والدخول دايماً من النت */
  if (/googleapis\.com$/.test(u.hostname) && !u.hostname.startsWith('fonts')) return;
  if (r.mode === 'navigate'){
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put('index.html', cp)); return res; })
      .catch(() => caches.match('index.html')));
    return;
  }
  if (u.origin === location.origin || u.hostname === 'www.gstatic.com' || u.hostname.startsWith('fonts.')){
    e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok || res.type === 'opaque'){ const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; })));
  }
});
