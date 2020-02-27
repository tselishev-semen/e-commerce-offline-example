// importScripts('./ngsw-worker.js');
if (typeof idb === "undefined") self.importScripts("https://cdn.jsdelivr.net/npm/idb@4.0.5/build/iife/with-async-ittr-min.js");
let db;

//https://thomashunter.name/posts/2019-04-30-service-workers
const STORAGE_NAME = 'static-v1'; // name of the current cache
const INDEX_PAGE = '/';

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

const initializeDb = async () => {
  db = await idb.openDB('e-commerce-db', '1', {
    upgrade(db, oldVersion, newVersion, transaction) {
      const productsStore = db.createObjectStore('products', {keyPath: "id"});
      productsStore.createIndex('categoryIndex', 'category');
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
  const preCache = async () => {
    const cache = await caches.open(STORAGE_NAME);
    await cache.addAll([
      INDEX_PAGE,
      '/favicon.ico'
    ])
  };
  console.log('INSTALL')
  event.waitUntil(async () => {
    await initializeDb();
    await preCache();
  });
  self.skipWaiting();
});


const cacheProductsRequest = async (product) => {
  let transaction = db.transaction('products', "readwrite");
  let productsStore = transaction.objectStore("products");
  productsStore.put(product);
  await transaction.done;
};

const cacheCategoryRequest = async (products) => {
  let transaction = db.transaction('products', "readwrite");
  let productsStore = transaction.objectStore("products");
  products.forEach((product) => {
    productsStore.put(product)
  });
  await transaction.done;
};


const isProductsRequest = (url) => /\.netlify\/functions\/products/.test(url);
const isCategoryRequest = (url) => /\.netlify\/functions\/category/.test(url);

const forwardCachedResources = (event) => async () => {
  let requestUrl = event.request.url;
  const entity = requestUrl.replace(/\/(.*)$/, '$1');
  // console.log(entity, isCategoryRequest, isProductsRequest)
  if (isCategoryRequest(requestUrl)) {
    const products = await getProductByCategory(entity);
    console.log(products)
    return products
  } else if (isProductsRequest((requestUrl))) {
    const product = await getProductById(entity);
    return product
  }
  throw event;
  // return fetch(event.request);
}


self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    fetch(event.request.url)
      .catch(async () => {
        console.log('CATCH navigate ')
        const cache = await caches.open(STORAGE_NAME);
        const cachedResponse = await cache.match(INDEX_PAGE);
        return cachedResponse;
      })
  }
  // console.log(event, event.request.mode === 'navigate')
  let url = event.request.url;
  if (/\.netlify\/functions/.test(url)) {
    console.log('URL')
    console.log(55)

    return event.respondWith(
      fetch(event.request.url)
        .then(async (result) => {
          console.log(1111)
          console.log('then', isProductsRequest(url), isCategoryRequest(url))
          // if (isProductsRequest(url)) {
          //   await cacheProductsRequest(result);
          // } else if (isCategoryRequest(url)) {
          //   await cacheCategoryRequest(result)
          // }
          return result
        })
        .catch(forwardCachedResources(event))
    );
  }

  if (!url.startsWith(self.location.origin) || event.request.method !== 'GET') {
    // External request, or POST, ignore
    return void event.respondWith(fetch(event.request));
  }

  event.respondWith(
    // Always try to download from server first
    fetch(event.request).then(response => {
      // When a download is successful cache the result
      caches.open(STORAGE_NAME).then(cache => {
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
        return caches.open(STORAGE_NAME).then((cache) => {
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

//https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests
