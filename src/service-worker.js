// importScripts('./ngsw-worker.js');
if (typeof idb === "undefined") self.importScripts("https://cdn.jsdelivr.net/npm/idb@4.0.5/build/iife/with-async-ittr-min.js");
let db;

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

self.addEventListener('install', async function (event) {
  console.log('install1')
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();
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
self.addEventListener('fetch', function (event) {
  console.log(/\.netlify\/functions/.test(event.request.url))
  event.respondWith(
    // fetch(event.request)
    // forwardCachedResources(event)
    fetch(event.request).catch(forwardCachedResources(event))
  );
});


// const request = db.open('example-db', 1);
// request.addEventListener('error', (event) => {
//   console.log('Request error:', request.error);
// };

// how ro refresh?
// how to handle errors?
// https://glebbahmutov.com/
