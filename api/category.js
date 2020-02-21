import {CARS_PRODUCTS, MISC_PRODUCTS} from './mocks/products';

export async function handler(event, context) {
  const pathRegExp = /.*\/(.*)$/;

  const hasCategory = pathRegExp.test(event.path);
  if (hasCategory) {
    const category = event.path.replace(pathRegExp, '$1');
    console.log(category);
    if (category === 'cars') {
      return {
        statusCode: 200,
        body: JSON.stringify([...CARS_PRODUCTS.values()])
      };
    } else if (category === 'misc') {
      return {
        statusCode: 200,
        body: JSON.stringify([...MISC_PRODUCTS.values()])
      };
    }
    return {
      body: 'Category was not found',
      statusCode: 404,
    };
  }
  return {
    body: 'Invalid request',
    statusCode: 500,
  };
}
