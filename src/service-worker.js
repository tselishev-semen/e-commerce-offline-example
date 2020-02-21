// importScripts('./ngsw-worker.js');
if (typeof idb === "undefined") self.importScripts("https://cdn.jsdelivr.net/npm/idb@4.0.5/build/iife/with-async-ittr-min.js");
let db;

//https://thomashunter.name/posts/2019-04-30-service-workers
const CACHE = 'static-v1'; // name of the current cache
const OFFLINE = '/';
const AUTO_CACHE = [ // URLs of assets to immediately cache
  OFFLINE,
  '/',
  '/service-worker.js',
  '/manifest.webmanifest',
  '/favicon.ico',
];

async function getProductById(id) {
  let transaction = db.transaction('products', "readonly");
  let productsStore = transaction.objectStore("products");
  // let categoryIndex = productsStore.index("categoryIndex");
  const product = await productsStore.get(id);
  await transaction.done;
  return product
}

async function getProductByCategory(category) {
  let transaction = db.transaction('products', "readonly");
  let productsStore = transaction.objectStore("products");
  let categoryIndex = productsStore.index("categoryIndex");
  const products = await categoryIndex.getAll(category);
  await transaction.done;
  return products
}

const initializeDb = async ()=>{
  db = await idb.openDB('e-commerce-db', '1', {
    upgrade(db, oldVersion, newVersion, transaction) {
      const productsStore = db.createObjectStore('products', {keyPath: "id"});
      productsStore.createIndex('categoryIndex', 'category');

      productsStore.put({id: '1', name: 'product1', category: 'shoes'});
      productsStore.put({id: '2', name: 'product2', category: 'dress'});
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
  return db;
}

self.addEventListener('install', function (event) {
  console.log('INSTALL')
  event.waitUntil(
    initializeDb()
  // caches.open(CACHE)
  //     .then(cache => cache.addAll(AUTO_CACHE))
  //     .then(initializeDb)
  //     .then(self.skipWaiting())
  );
});


const forwardCachedResources = (event) => async () => {

  let requestUrl = event.request.url;
  let isCategoryRequest = /\.netlify\/functions\/categories/.test(requestUrl);
  let isProductsRequest = /\.netlify\/functions\/products/.test(requestUrl);
  const entity = requestUrl.replace(/\/(.*)$/, '$1');
  console.log(entity, isCategoryRequest, isProductsRequest)
  if (isCategoryRequest) {
    const products = await getProductByCategory(entity);
    console.log(products)
    return products
    // const product = requestUrl.replace(/categories\/(.*)/, '$1');
  } else if (isProductsRequest) {
    const product = await getProductById(entity);
    return product
  }
  return fetch(event.request);
}


self.addEventListener('fetch', event => {
  if(/\.netlify\/functions/.test(event.request.url)){
    console.log('URL')
    return event.respondWith(
      fetch(event.request).catch(forwardCachedResources(event))
    );
  }

  if (!event.request.url.startsWith(self.location.origin) || event.request.method !== 'GET') {
    // External request, or POST, ignore
    return void event.respondWith(fetch(event.request));
  }

  event.respondWith(
    // Always try to download from server first
    fetch(event.request).then(response => {
      // When a download is successful cache the result
      caches.open(CACHE).then(cache => {
        cache.put(event.request, response)
      });
      // And of course display it
      return response.clone();
    }).catch((_err) => {
      // A failure probably means network access issues
      // See if we have a cached version
      return caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          // We did have a cached version, display it
          return cachedResponse;
        }

        // We did not have a cached version, display offline page
        return caches.open(CACHE).then((cache) => {
          const offlineRequest = new Request('/');
          return cache.match(offlineRequest);
        });
      });
    })
  );
});


// how ro refresh?
// how to handle errors?
// https://glebbahmutov.com/
