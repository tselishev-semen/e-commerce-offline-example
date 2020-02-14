import {ALL_PRODUCTS} from './mocks/products';

export async function handler(event, context) {
  const pathRegExp = /.*\/(\d+)$/;

  const hasId = pathRegExp.test(event.path);
  if (hasId) {
    const productId = Number(event.path.replace(pathRegExp, '$1'));
    console.log(productId);
    if (ALL_PRODUCTS.has(productId)) {
      return {
        statusCode: 200,
        body: JSON.stringify(ALL_PRODUCTS.get(productId))
      };
    }
    return {
      body: `Product with id: ${productId} was not found`,
      statusCode: 404,
    };
  }

  return {
    body: 'Malformed request',
    statusCode: 404,
  };
}
