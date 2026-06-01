const CACHE_NAME = 'driftplan-v2';
const STATIC_ASSETS = ['/', '/manifest.json'];

// Keys used by the app to persist the last itinerary and saved trips list
const PERSIST_KEYS = ['driftplan-store', 'driftplan-itinerary'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Never cache API routes or auth
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return;

  // Next.js RSC / data requests — skip
  if (url.searchParams.has('_rsc')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request).then((response) => {
        if (response.ok && url.origin === self.location.origin) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached ?? new Response('Offline', { status: 503 }));

      // For navigation requests, try network first so the app always gets fresh HTML
      if (event.request.mode === 'navigate') return networkFetch;

      return cached || networkFetch;
    })
  );
});

// Message handler: app can post { type: 'CACHE_ITINERARY', payload } to cache the
// last itinerary JSON so it's readable offline
self.addEventListener('message', (event) => {
  if (event.data?.type === 'CACHE_ITINERARY') {
    const payload = JSON.stringify(event.data.payload ?? {});
    caches.open(CACHE_NAME).then((cache) =>
      cache.put(
        new Request('/__offline_itinerary__'),
        new Response(payload, { headers: { 'Content-Type': 'application/json' } })
      )
    );
  }
});
