const https = require('https');

function fetchYahooImage(query) {
  return new Promise((resolve) => {
    https.get(`https://images.search.yahoo.com/search/images?p=${encodeURIComponent(query)}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/<img[^>]+src="([^">]+)"/);
        if (match && match[1]) {
          resolve(match[1]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

fetchYahooImage('Sony WH-1000XM5').then(url => console.log('Yahoo:', url));
