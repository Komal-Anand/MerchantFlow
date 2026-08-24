const https = require('https');

function scrapeBingImage(query) {
  return new Promise((resolve) => {
    https.get(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC3`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        // Bing image search results have m="{...\"murl\":\"https://...\"...}"
        const match = data.match(/"murl":"([^"]+)"/);
        if (match && match[1]) {
          resolve(match[1]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

scrapeBingImage('Apple MacBook Air M3 13 product photo').then(url => console.log('Bing URL:', url));
