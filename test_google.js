const https = require('https');

function scrapeGoogleImage(query) {
  return new Promise((resolve) => {
    https.get(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; rv:11.0) Gecko/20100101 Firefox/11.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        // Find the first image that is not a tracking pixel or Google logo
        const matches = [...data.matchAll(/<img[^>]+src="([^">]+)"/g)];
        const urls = matches.map(m => m[1]).filter(url => url.startsWith('http') && !url.includes('googlelogo'));
        if (urls.length > 0) {
          resolve(urls[0]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

scrapeGoogleImage('Philips Air Fryer XXL').then(url => console.log('Google:', url));
