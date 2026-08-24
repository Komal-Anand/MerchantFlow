const https = require('https');
const fs = require('fs');

async function searchUnsplash(query) {
  return new Promise((resolve) => {
    https.get('https://unsplash.com/s/photos/' + encodeURIComponent(query), {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/"id":"([a-zA-Z0-9_\-]{11})"/);
        if (match) {
          resolve(match[1]);
        } else {
          resolve('error');
        }
      });
    }).on('error', () => resolve('error'));
  });
}

async function run() {
  const queries = ['sony headphones', 'macbook air', 'samsung galaxy phone', 'ipad pro', 'bose earbuds', 'canon mirrorless camera', 'levis jeans', 'nike air max', 'oxford shirt', 'adidas ultraboost', 'fossil smartwatch', 'hair dryer', 'facial serum', 'skincare kit', 'hair removal', 'instant pot', 'dyson vacuum', 'air fryer', 'ikea shelf', 'nespresso machine', 'garmin watch', 'badminton racket', 'yoga mat', 'fitbit tracker', 'dumbbells', 'samsonite luggage', 'travel backpack', 'portable charger', 'dji drone', 'carry on luggage'];
  let results = {};
  for (let q of queries) {
    results[q] = await searchUnsplash(q);
    console.log(q + ' -> ' + results[q]);
  }
  fs.writeFileSync('unsplash_ids.json', JSON.stringify(results, null, 2));
}

run();
