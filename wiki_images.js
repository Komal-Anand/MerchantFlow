const https = require('https');
const fs = require('fs');
const { PRODUCTS } = require('./lib/products.js');

const queryMap = {
  // Electronics
  'e001': 'Headphones',
  'e002': 'Laptop computer',
  'e003': 'Smartphone',
  'e004': 'Tablet computer',
  'e005': 'Wireless earbuds',
  'e006': 'Mirrorless camera',
  'e007': 'PlayStation 5',
  'e008': 'OLED TV',
  'e009': 'Computer mouse',
  'e010': 'E-reader',
  
  // Fashion
  'f001': 'Blue jeans',
  'f002': 'Sneakers',
  'f003': 'Dress shirt',
  'f004': 'Running shoes',
  'f005': 'Smartwatch',
  'f006': 'Aviator sunglasses',
  'f007': 'Leather belt',
  'f008': 'Puma Suede',
  'f009': 'Winter coat',
  'f010': 'Casio G-Shock watch',

  // Beauty
  'b001': 'Hair dryer',
  'b002': 'Face serum',
  'b003': 'Skin care kit',
  'b004': 'Epilator',
  'b005': 'Lipstick',
  'b006': 'Essential oil bottle',
  'b007': 'Perfume bottle',
  'b008': 'Skin cream',
  'b009': 'Mascara',
  'b010': 'Cold cream',

  // Home & Kitchen
  'h001': 'Pressure cooker',
  'h002': 'Vacuum cleaner',
  'h003': 'Air fryer',
  'h004': 'Bookcase',
  'h005': 'Espresso machine',
  'h006': 'Stand mixer',
  'h007': 'Robotic vacuum cleaner',
  'h008': 'Dutch oven',
  'h009': 'Blender',
  'h010': 'Barbecue grill',

  // Sports
  's001': 'GPS watch',
  's002': 'Badminton racket',
  's003': 'Yoga mat',
  's004': 'Activity tracker',
  's005': 'Dumbbell',
  's006': 'Basketball',
  's007': 'Swim goggles',
  's008': 'Golf club',
  's009': 'T-shirt',
  's010': 'Massage gun',

  // Travel
  't001': 'Suitcase',
  't002': 'Backpack',
  't003': 'Power bank',
  't004': 'Quadcopter',
  't005': 'Hand luggage',
  't006': 'Noise cancelling headphones',
  't007': 'Swiss Army knife',
  't008': 'Travel pillow',
  't009': 'Action camera',
  't010': 'Packing cubes'
};

function fetchWikiImageCorrectly(query) {
  return new Promise((resolve) => {
    https.get(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&pithumbsize=800&format=json`, {
      headers: {
        'User-Agent': 'MerchantFlowBot/1.0 (https://merchantflow.app)'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (pages) {
            const pageId = Object.keys(pages)[0];
            if (pages[pageId].thumbnail?.source) {
              resolve(pages[pageId].thumbnail.source);
              return;
            }
          }
        } catch (e) {}
        resolve(null);
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const newProducts = [...PRODUCTS];
  for (let i = 0; i < newProducts.length; i++) {
    const p = newProducts[i];
    const q = queryMap[p.id] || p.name;
    const img = await fetchWikiImageCorrectly(q);
    if (img) {
      p.image = img;
      console.log(`✅ ${p.id}: Found image for ${q}`);
    } else {
      console.log(`❌ ${p.id}: No image found for ${q}`);
      // Fallback
      p.image = `https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/800px-No_image_available.svg.png`;
    }
  }

  const fileContent = `export const PRODUCTS = ${JSON.stringify(newProducts, null, 2)};\n`;
  fs.writeFileSync('./lib/products.js', fileContent);
  console.log('Saved to lib/products.js');
}

run();
