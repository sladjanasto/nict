// Service Worker for Portfolio Site Performance Optimization
const CACHE_NAME = 'portfolio-v1.2.0';
const RUNTIME_CACHE = 'runtime-cache-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/icons/style.css',
  '/hero-bg-pattern.svg',
  '/group.avif',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('SW: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Clone the request because it's a stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response because it's a stream
          const responseToCache = response.clone();

          // Cache strategy based on request type
          if (shouldCache(event.request)) {
            caches.open(getCacheName(event.request))
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }

          return response;
        }).catch(() => {
          // Network failed, try to return cached version
          return caches.match('/offline.html') || new Response('Offline');
        });
      })
  );
});

// Determine if request should be cached
function shouldCache(request) {
  const url = new URL(request.url);
  
  // Cache same-origin requests
  if (url.origin === location.origin) {
    return true;
  }
  
  // Cache Google Fonts
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    return true;
  }
  
  return false;
}

// Get appropriate cache name
function getCacheName(request) {
  const url = new URL(request.url);
  
  // Use static cache for assets that don't change often
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2)$/)) {
    return CACHE_NAME;
  }
  
  // Use runtime cache for other requests
  return RUNTIME_CACHE;
}

// Background sync for offline actions (optional enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

// Sync contact form submissions when back online
async function syncContactForm() {
  try {
    // Implementation for offline form submission sync
    console.log('SW: Syncing contact form submissions');
  } catch (error) {
    console.error('SW: Failed to sync contact form', error);
  }
}

// Push notification support (optional enhancement)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const options = {
    body: event.data.text(),
    icon: '/favicon-32x32.png',
    badge: '/favicon-16x16.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Portfolio Update', options)
  );
});