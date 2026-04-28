const CACHE_NAME = 'paejjik-cache-v1';

// 로딩 속도를 높이기 위해 미리 저장해 둘 파일들
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // DB 요청(Supabase)은 무조건 실시간으로 받아오도록 예외 처리
  if (event.request.url.includes('supabase.co')) {
    return;
  }

  // 나머지 화면이나 라이브러리는 캐시(저장소)에서 먼저 꺼내서 로딩 속도 극대화
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
