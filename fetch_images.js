const https = require('https');

function fetchUnsplashImage(query) {
  return new Promise((resolve) => {
    https.get(`https://unsplash.com/s/photos/${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const match = data.match(/images\.unsplash\.com\/photo-[0-9a-zA-Z-]+/);
        if (match) {
          resolve(`https://${match[0]}?auto=format&fit=crop&q=80&w=800&h=800`);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

const items = [
  'mens-shirt', 'jeans', 'moisturizer', 'hair-removal', 'shelf', 'mascara',
  'drone', 'stand-mixer', 'packing-cubes', 'pocket-knife', 'dutch-oven', 'luggage', 'travel-pillow',
  'headphones', 'badminton', 'kindle-reader', 'espresso-machine', 'perfume-bottle'
];

async function run() {
  for (const item of items) {
    const url = await fetchUnsplashImage(item);
    console.log(`${item}: ${url}`);
  }
}

run();
