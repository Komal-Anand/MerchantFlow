const https = require('https');
const fs = require('fs');
const { PRODUCTS } = require('./lib/products.js');

const fixMap = {
  'f009': 'Overcoat',
  'f010': 'Digital watch',
  'b007': 'Perfume',
  'b008': 'Moisturizer',
  's008': 'Golf club'
};

async function run() {
  let p = [...PRODUCTS];
  for (const id of Object.keys(fixMap)) {
    const query = fixMap[id];
    await new Promise(r => {
      https.get(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&pithumbsize=800&format=json`, {
        headers: {'User-Agent': 'MerchantFlowBot/1.0'}
      }, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          try {
            const j = JSON.parse(d);
            const pid = Object.keys(j.query.pages)[0];
            if (j.query.pages[pid].thumbnail) {
              p.find(x => x.id === id).image = j.query.pages[pid].thumbnail.source;
              console.log('Fixed ' + id);
            }
          } catch(e) {}
          r();
        });
      });
    });
  }
  fs.writeFileSync('./lib/products.js', 'export const PRODUCTS = ' + JSON.stringify(p, null, 2) + ';\n');
}

run();
