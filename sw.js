const CACHE_NAME = 'pachislot-tool-cache-20260528125719'; // Cache version incremented
const URLS_TO_CACHE = [
  './',
  './index.html', 
  './index.tsx',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap',
  './zz_image/icon/icon-192x192.png', 
  './zz_image/icon/icon-512x512.png',
  './zz_image/background/background-monkey-turn-v.jpg',
  './zz_image/background/background-king-hana-hana-s.jpg',
  './zz_image/background/background-hana-hana-houou.jpg',
  './zz_image/background/background-my-juggler.jpg',
  './zz_image/background/background-im-juggler.jpg',
  './zz_image/background/background-gogo-juggler.jpg',
  './zz_image/background/background-funky-juggler.jpg',
  './zz_image/background/background-dragon-hana-hana.jpg',
  './zz_image/background/background-star-hana-hana.jpg',
  './zz_image/background/background-new-getter-mouse.jpg',
  './zz_image/background/background-happy-juggler.jpg',
  // Monkey Turn V Character Images
  './zz_image/round/1_HATANO.jpg',
  './zz_image/round/2_ENOKI.jpg',
  './zz_image/round/3_DOGUCHI.jpg',
  './zz_image/round/4_GAMO.jpg',
  './zz_image/round/5_HAMAOKA.jpg',
  './zz_image/round/6_KOIKE.jpg',
  './zz_image/round/7_DOGUCHI_SR.jpg',
  './zz_image/round/8_ARISA.jpg',
  './zz_image/round/9_KAKOTACHI.jpg',
  './zz_image/round/10_AOSHIMA.jpg',
  './zz_image/round/11_KUSHIDA_HAGIWARA_KOBAYASHI.jpg',
  './zz_image/round/12_PLAYER_COLLECTIVE.jpg',
  './zz_image/round/13_HATANO_FAMILY.jpg',
  './zz_image/round/14_GENERATION_82.jpg',
  './zz_image/round/15_FEMALE_CHARS.jpg',
  './zz_image/round/16_SUMI.jpg',
  './zz_image/round/17_MONOCHROME_HATANO.jpg',
  './zz_image/round/18_MONOCHROME_ENOKI.jpg',
  './zz_image/round/19_HATANO_SUMI.jpg',
  './zz_image/round/20_BOAT_KELOT.jpg',
  // Monkey Turn V Scenario Images
  './zz_image/scenario/1_kakedashi.png',
  './zz_image/scenario/2_osozaki.png',
  './zz_image/scenario/3_kantogamashi.png',
  './zz_image/scenario/4_derbyking.png',
  './zz_image/scenario/5_tsukemaikousha.png',
  './zz_image/scenario/6_gambler.png',
  './zz_image/scenario/7_kouitenn.png',
  './zz_image/scenario/8_douguchi_special.png',
  './zz_image/scenario/9_keikai_heroine.png',
  './zz_image/scenario/10_ippansen_no_oni.png',
  './zz_image/scenario/11_aichi_no_kyojin.png',
  './zz_image/scenario/12_saikyo_b2.png',
  './zz_image/scenario/13_gyakugeki_no_teio.png',
  './zz_image/scenario/14_teio.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        const cachePromises = URLS_TO_CACHE.map(urlToCache => {
          const request = new Request(urlToCache, { mode: 'cors' });
          return fetch(request).then(response => {
            if (response.status === 200 || response.type === 'opaque') {
              return cache.put(request, response);
            }
            return Promise.resolve();
          }).catch(() => Promise.resolve());
        });
        return Promise.all(cachePromises);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || (networkResponse.status !== 200 && networkResponse.type !== 'opaque')) return networkResponse;
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
            return networkResponse;
          })
          .catch(() => {});
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) return caches.delete(cacheName);
        })
      );
    })
  );
  return self.clients.claim();
});