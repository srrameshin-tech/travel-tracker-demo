const CACHE_NAME = 'travel-tracker-v1';

self.addEventListener('install', (e)=>{ self.skipWaiting(); });

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(names => Promise.all(
      names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e)=>{
  e.respondWith(
    fetch(e.request).then(res=>{
      const resClone = res.clone();
      caches.open(CACHE_NAME).then(cache=> cache.put(e.request, resClone));
      return res;
    }).catch(()=> caches.match(e.request))
  );
});
