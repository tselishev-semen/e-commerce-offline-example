// importScripts('./ngsw-worker.js');
if (typeof idb === "undefined") self.importScripts("https://cdn.jsdelivr.net/npm/idb@4.0.5/build/iife/with-async-ittr-min.js");
let db;
console.log(idb)
self.addEventListener('install', async function (event) {
  console.log('install1')
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();
  db = await idb.openDB('e-commerce-db', '1', {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log('upgrade')
      const categoriesStore = db.createObjectStore('categories', {keyPath: "id"});
      const productsStore = db.createObjectStore('products', {keyPath: "id"});

      productsStore.put({id:'1', name: 'product'})
      categoriesStore.put({id:'1', name: 'category'})
      console.log(db)
    },
    blocked() {
      // …
    },
    blocking() {
      // …
    },
    terminated() {
      // …
    },
  });

  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();
});
self.addEventListener('fetch', function (event) {
  console.log(/\.netlify\/functions/.test(event.request.url))
  if (/\.netlify\/functions/.test(event.request.url)) {
    event.respondWith(
      fetch(event.request).catch(function () {

        return caches.match(event.request);
      })
    );
  }

});


// const request = db.open('example-db', 1);
// request.addEventListener('error', (event) => {
//   console.log('Request error:', request.error);
// };

// Request.destination
