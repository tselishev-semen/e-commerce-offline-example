const car1 = {
  id: 1,
  image: 'https://i.picsum.photos/id/1072/3872/2592.jpg',
  name: 'Rusted Truck Old',
  color: 'rusted yellow',
  year: 1976,
  description: 'I come to see you in the night.' +
    ' I wanna see you lying down, into that cold, cold, cold, cold ground' +
    'Close the door and turn the key.' +
    ' I locks the door.' +
    ' And it\'s time to sleep.' +
    ' And all those pretty treasures are deep. Once revealed inside a dream.' +
    ' Diamonds shine on a water\'s edge.' +
    ' Never make it back from sea.' +
    ' To pray for nothing short of breath.' +
    ' Oh no never do we breathe',
  category: 'cars',
  price: 5000,
  salePrice: 4500,
  quantity: 2,
  promo: 'Farmer choice'
};

const car2 = {
  id: 2,
  image: 'https://i.picsum.photos/id/1071/3000/1996.jpg',
  name: 'Lincoln continental',
  color: 'stylish green',
  year: 1981,
  description: 'By allowing drivers to keep their eyes on the road, ' +
    'the head-up display** helps make responding to the road ahead easier. ' +
    'It contributes to a custom driving experience by letting drivers choose what data to display,' +
    ' from standard driving information to Adaptive Cruise Control settings, Lane-Keeping System information and more. ' +
    'The Continental head-up display is visible in ambient lighting even when the driver is wearing polarized sunglasses',
  category: 'cars',
  price: 50000,
  quantity: 1
};

const car3 = {
  id: 3,
  image: 'https://i.picsum.photos/id/111/4400/2656.jpg',
  name: 'A vintage car with Farmer Boy plate',
  color: 'vintage',
  year: 1929,
  description: 'The vintage era in the automotive world was a time of transition.' +
    ' The car started off in 1919 as still something of a rarity, and ended up, in 1930,' +
    ' well on the way towards ubiquity. In fact, automobile production at the end of this ' +
    'period was not matched again until the 1950s. In the intervening years, most industrialized ' +
    'countries built nationwide road systems with the result that, towards the end of the period, ' +
    'the ability to negotiate unpaved roads was no longer a prime consideration of automotive design.',
  category: 'cars',
  price: 34000,
  quantity: 1,
  promo: 'Top-seller'
};

const car4 = {
  id: 4,
  image: 'https://i.picsum.photos/id/183/2316/1544.jpg',
  name: 'BMW Lab',
  color: 'blank blue',
  year: 1989,
  description: 'Compared with carbon, flax has greater absorption and greater impact resistance,' +
    ' which can be advantageous on the street circuits with their bumps and crash barriers, ' +
    'on which Formula E takes place. The same is true of contact with other CARS_PRODUCTS during races',
  category: 'cars',
  price: 14000,
  quantity: 10,
};

const car5 = {
  id: 5,
  image: 'https://i.picsum.photos/id/45/4592/2576.jpg',
  name: 'Tuk Tuk',
  color: 'yellow-green',
  year: 2009,
  description: 'Why take a tuk-tuk instead of a taxi? Some travelers mistakenly assume that tuk-tuks ' +
    'are a cheaper option for getting around. The smaller vehicles lack a lot of the creature comforts of ' +
    'regular taxis and seem like they would use less fuel, so the logic makes sense.',
  category: 'cars',
  price: 2000,
  salePrice: 1900,
  quantity: 100,
};


export const CARS_PRODUCTS = new Map();
CARS_PRODUCTS.set(1, car1);
CARS_PRODUCTS.set(2, car2);
CARS_PRODUCTS.set(3, car3);
CARS_PRODUCTS.set(4, car4);
CARS_PRODUCTS.set(5, car5);




const product1 = {
  id: 10,
  image: 'https://i.picsum.photos/id/212/2000/1394.jpg',
  name: 'Street Bicycle',
  color: 'blue',
  year: 2018,
  description: 'You say black I say white. ' +
    'You say bark I say bite ' +
    'You say shark I say hey man ' +
    'Jaws was never my scene ' +
    'And I don\'t like Star Wars You say Rolls I say Royce ' +
    'You say God give me a choice ' +
    'You say Lord I say Christ ' +
    'I don\'t believe in Peter Pan Frankenstein or Superman All I wanna do is',
  category: 'misc',
  price: 200,
  salePrice: 190,
  quantity: 1,
};

const product2 = {
  id: 11,
  image: 'https://i.picsum.photos/id/1071/3000/1996.jpg',
  name: 'Old ship',
  color: 'beige',
  year: 2001,
  description: 'Did you see that boat for sale by the side of the road? ' +
    'It\'d only cost us fiftyCould you imagine if we ' +
    'Bought that boat for sale? We could sail it down the river ' +
    'Throw caution to the wind And just surrender To something bigger ' +
    'Maybe one day we Could take it out to sea Oh, just for fun Day on the ocean',
  category: 'misc',
  price: 70000,
  quantity: 3
};

const product3 = {
  id: 12,
  image: 'https://i.picsum.photos/id/401/5184/3456.jpg',
  name: 'Hot air balloon',
  color: 'vintage',
  year: 1929,
  description: 'The craft, which is made of recycled plastic bags, will be launched ' +
    'in London and travel across Europe, Russia and China before reaching its final ' +
    'destination in Korea - with fans tracking its progress online, and helping out if it gets marooned.',
  category: 'misc',
  price: 100000,
  quantity: 10,
  promo: 'Top-seller'
};


export const MISC_PRODUCTS = new Map();
MISC_PRODUCTS.set(10, product1);
MISC_PRODUCTS.set(11, product2);
MISC_PRODUCTS.set(12, product3);

export const ALL_PRODUCTS = new Map();
ALL_PRODUCTS.set(1, car1);
ALL_PRODUCTS.set(2, car2);
ALL_PRODUCTS.set(3, car3);
ALL_PRODUCTS.set(4, car4);
ALL_PRODUCTS.set(5, car5);
ALL_PRODUCTS.set(10, product1);
ALL_PRODUCTS.set(11, product2);
ALL_PRODUCTS.set(12, product3);




