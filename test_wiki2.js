const https = require('https');

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

fetchWikiImageCorrectly('Jeans').then(url => console.log('Jeans:', url));
fetchWikiImageCorrectly('Philips Air Fryer').then(url => console.log('Air Fryer:', url));
