if (typeof idb === "undefined") self.importScripts("https://cdn.jsdelivr.net/npm/idb@4.0.5/build/iife/with-async-ittr-min.js");
let db;


const STORAGE_NAME = 'static-v1';
const DB_VERSION = '1';
const INDEX_PAGE = '/';

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

    //resources
    await cache.addAll([
      INDEX_PAGE,
      '/favicon.ico'
    ]);
  };
  return Promise.all([preCache(), initializeDb()]);
}

self.addEventListener('install', (event) => {
  event.waitUntil(installSW());
  //to apply SW immediately. Only for the demo purpuse.
  self.skipWaiting();
});


//Fetch phase
async function getProductById(id) {
  let transaction = db.transaction('products', "readonly");
  let productsStore = transaction.objectStore("products");
  const product = await productsStore.get(id);
  // await transaction.done;
  return product
}

async function getProductByCategory(category) {
  let transaction = db.transaction('products', "readonly");
  let productsStore = transaction.objectStore("products");
  let categoryIndex = productsStore.index("categoryIndex");
  const products = await categoryIndex.getAll(category);
  // await transaction.done;
  return products
}


const cacheProductsRequest = async (product) => {
  let transaction = db.transaction('products', "readwrite");
  let productsStore = transaction.objectStore("products");
  productsStore.put(product);
  await transaction.done;
};

const cacheCategoryRequest = async (products) => {
  console.log(products);
  let transaction = db.transaction('products', "readwrite");
  let productsStore = transaction.objectStore("products");
  products.forEach((product) => {
    productsStore.put(product)
  });
  return await transaction.done;
};


const isProductsRequest = (url) => /\.netlify\/functions\/products/.test(url);
const isCategoryRequest = (url) => /\.netlify\/functions\/category/.test(url);


//forward, dispatch
async function redirectToIndexPage() {
  console.log('CATCH navigate')
  const cache = await caches.open(STORAGE_NAME);
  //todo: what will happen if cache is empty?
  return await cache.match(INDEX_PAGE);
}


//todo: https://developers.google.com/web/fundamentals/primers/service-workers/#the_defaults_of_fetch
//todo: what if we want to extend that by full applying full - search
self.addEventListener('fetch', event => {
  const url = event.request.url;
  // all navigation request are dispatch to index.html
  //todo: add this to the initial conditions of the tasks
  if (event.request.mode === 'navigate') {
    return void event.respondWith(fetch(event.request).catch(redirectToIndexPage));
    // console.log('NENENEW')
    // return void fetch(event.request).catch(redirectToIndexPage);
  }

  if (!url.startsWith(self.location.origin) || event.request.method !== 'GET') {
    // External request, or POST, ignore
    return void event.respondWith(fetch(event.request));
  }

  // console.log(event.request);
  // all api request have fallback for offline mode
  //todo: what if data incorrect of there is some error
  if (isCategoryRequest(url)) {
    console.log('isCategoryRequest:', url)

    return void event.respondWith(
      fetch(event.request)
        .then(async (response) => {
          console.log(1111, response);
          await cacheCategoryRequest(await response.clone().json());
          console.log(222, 'mememe');

          return response;
        })
        .catch(async e => {
          console.log(e, 'error ')
          const category = url.replace(/.*\/(.*)$/, '$1');
          const products = await getProductByCategory(category);
          console.log(products)
          return new Response(JSON.stringify(products));
        })
    );
  }
  if (isProductsRequest(url)) {
    console.log('isProductsRequest:', url)
    return void event.respondWith(
      fetch(event.request)
        .then(async (result) => {
          console.log(1111, result);
          await cacheProductsRequest(await result.clone().json());
          return result
        })
        .catch(async e => {
          const productId = Number(url.replace(/.*\/(.*)$/, '$1'));
          const product = await getProductById(productId);
          console.log(product)
          return new Response(JSON.stringify(product))
        })
    );
  }
  event.respondWith(processStaticResources(event.request));
});

async function processStaticResources(request) {
  // Always try to download from server first
  return fetch(request).then(async response => {
    // When a download is successful cache the result
    const cache = await caches.open(STORAGE_NAME)
    await cache.put(request, response);
    // And of course display it
    //todo: why do we need clone here
    return response.clone();
  }).catch(async err => {
    // A failure probably means network access issues
    // See if we have a cached version
    //todo: doesn;t it generate an error if cache is missing
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // We did have a cached version, display it
      return cachedResponse;
    }
    //just return an error if can't handle
    throw err;
  })
}

//https://googlechrome.github.io/samples/service-worker/custom-offline-page/
// how ro refresh?
// how to handle errors?
// https://glebbahmutov.com/

//https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests
