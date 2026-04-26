// 패찍이 PWA Service Worker
const CACHE_NAME = 'paechhik-v1';
const ESSENTIAL = [
  './',
  './index.html',
  './manifest.json'
];

// 설치: 핵심 파일만 캐시
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ESSENTIAL).catch(() => {}))
  );
});

// 활성화: 옛날 캐시 청소
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 요청: 네트워크 우선, 실패시 캐시 (Supabase 호출은 항상 네트워크)
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  
  // Supabase API는 캐시 안 함
  if (url.hostname.includes('supabase')) return;
  
  // GET 요청만 캐시
  if (e.request.method !== 'GET') return;
  
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // 성공한 응답은 캐시에 저장
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
