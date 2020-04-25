if (typeof idb === "undefined") self.importScripts("https://cdn.jsdelivr.net/npm/idb@4.0.5/build/iife/with-async-ittr-min.js");
// is defined during the 'install' event
let db;
const STORAGE_NAME = 'static-v1';
const DB_VERSION = '1';
const INDEX_PAGE = '/';

self.addEventListener('install', (event) => {
  async function installSW() {
    const initializeDb = async () => {
      //WARNING: The code doesn't have any migration strategy for updating DB. Take care about it before go to live.
      db = await idb.openDB('e-commerce-db', DB_VERSION, {
        upgrade(db) {
          /**
           * create a table to store products in normalized manner
           * schema:
           * {
           *  id: number,
           *  category: string
           *  [restProperties: string]: any
           * }
           */
          const productsStore = db.createObjectStore('products', {keyPath: "id"});
          /** create an index to search products by 'category' property*/
          productsStore.createIndex('categoryIndex', 'category');
        }
      });
    };
    const preCache = async () => {
      const cache = await caches.open(STORAGE_NAME);
      //resources required for offline mode
      await cache.addAll([
        INDEX_PAGE,
        '/favicon.ico'
      ]);
    };
    return Promise.all([preCache(), initializeDb()]);
  }

  event.waitUntil(installSW().then(() => {
    self.skipWaiting();
  }));
  //to apply SW immediately. Only for the demo purpuse.
  console.log('success')

});


self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

async function readProductById(id) {
  const tx = db.transaction('products', "readonly");
  const store = tx.objectStore("products");
  return store.get(id);
}

async function readProductByCategory(category) {
  const tx = db.transaction('products', "readonly");
  const store = tx.objectStore("products");
  const categoryIndex = store.index("categoryIndex");
  return categoryIndex.getAll(category);
}

const saveProducts = async (products /*string & string[] */) => {
  const productsArray = [].concat(products);
  const tx = db.transaction('products', "readwrite");
  const store = tx.objectStore("products");
  productsArray.forEach((product) => store.put(product));
  return await tx.done;
};

async function matchIndexPage() {
  const cache = await caches.open(STORAGE_NAME);
  return await cache.match(INDEX_PAGE);
}

//todo: https://developers.google.com/web/fundamentals/primers/service-workers/#the_defaults_of_fetch
//todo: what if we want to extend that by full// if a navigation requests are considered as index.html and taken
//  applying full - search
//todo: add this to the initial conditions of the tasks
async function processCategoriesRequest(request) {
  return fetch(request)
    .then(async (response) => {
      await saveProducts(await response.clone().json());
      return response;
    })
    .catch(async e => {
      const category = request.url.replace(/.*\/(.*)$/, '$1');
      const products = await readProductByCategory(category);
      return new Response(JSON.stringify(products));
    })
}

async function processProductsRequest(request) {
  return fetch(request)
    .then(async (result) => {
      await saveProducts(await result.clone().json());
      return result
    })
    .catch(async e => {
      const productId = Number(request.url.replace(/.*\/(.*)$/, '$1'));
      const product = await readProductById(productId);
      return new Response(JSON.stringify(product))
    })
}

async function processStaticResources(request) {
  //NetworkFirst strategy for caching
  return fetch(request).then(async response => {
    const cache = await caches.open(STORAGE_NAME);
    await cache.put(request, response.clone());
    return response;
  }).catch(async err => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw err;
  })
}

self.addEventListener('fetch', event => {
  const url = event.request.url;
  console.log('fetch', url)
  if (event.request.mode === 'navigate') {
    /**
     * NetworkFirst strategy for caching
     *
     * If we have client-side rendering only and all pages are the same, we can deduce that
     * a response for any failed navigation request the same as for the index page
     */
    return void event.respondWith(fetch(event.request).catch(matchIndexPage));
  }
  console.log(url)

  if (!url.startsWith(self.location.origin) || event.request.method !== 'GET') {
    // External request, or POST, ignore
    return void event.respondWith(fetch(event.request));
  }

  if (/\.netlify\/functions\/categories/.test(url)) {
    return void event.respondWith(processCategoriesRequest(event.request));
  }

  if (/\.netlify\/functions\/products/.test(url)) {
    return void event.respondWith(processProductsRequest(event.request));
  }
  //WARNING: You should tune this approach since it caches all GET requests
  event.respondWith(processStaticResources(event.request));
});

