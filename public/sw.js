var CACHE_STATIC_NAME = 'static-v1';
var CACHE_DYNAMIC_NAME = 'dynamic';

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell ...');
        cache.addAll([
          '/',
          '/index.html',          
          '/img/1.png',
          '/img/2.png',
          '/img/3.png',
          '/img/4.png',
          '/img/5.png',
          '/img/6.png',
          '/img/7.png',
          '/img/8.png',
          '/img/9.png',
          '/img/10.png',
          '/img/girl.png',
          '/img/boy.png',
          '/img/saanvi.png',
        ]);
      })
  )
});


self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ...', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache. ' + key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  // check if request is made by chrome extensions or web page
  // if request is made for web page url must contains http.
  if (!(event.request.url.indexOf('http') === 0)) return; // skip the request. if request is not made with http protocol
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function (res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function (cache) {
                  //cache.put(event.request.url, res.clone())
                  return res;
                })
            })
            .catch(function (err) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function (cache) {
                  return cache.match('/404.html');
                });
            });
        }
      })
  );
});