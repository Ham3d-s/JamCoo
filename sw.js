const CACHE_NAME = 'jamcoo-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/css/style.css',
  '/src/js/script.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://html2canvas.hertzen.com/dist/html2canvas.min.js',
  // Vazirmatn Font Files
  'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css',
  'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Regular.woff2',
  'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Bold.woff2',
  'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Medium.woff2',
  // Font Awesome
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-brands-400.woff2'
];

// Install event: Cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use addAll for atomic caching
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache resources during install:', error);
          // Decide if install should fail or proceed partially
        });
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a stream and can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              // Don't cache opaque responses (like from CDNs without CORS) unless necessary
              // Be cautious caching external resources not explicitly listed
              return response;
            }

            // Clone the response because it's also a stream.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                 // Only cache GET requests
                 if(event.request.method === 'GET') {
                    cache.put(event.request, responseToCache);
                 }
              });

            return response;
          }
        ).catch(error => {
            // Network request failed, try to serve fallback content or just fail
            console.error('Fetch failed; returning offline page instead.', error);
            // Optionally return a specific offline page:
            // return caches.match('/offline.html');
        });
      })
    );
});
