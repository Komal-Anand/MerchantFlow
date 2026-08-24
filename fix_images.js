const fs = require('fs');

const file = 'lib/products.js';
let content = fs.readFileSync(file, 'utf8');

const replacements = {
  // Unfit images
  'Amazon Kindle Paperwhite': {
    old: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/kindle,ereader/all'
  },
  'Nespresso Vertuo Next Coffee Machine': {
    old: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/espresso-machine,coffee-maker/all'
  },
  'Chanel No. 5 Eau de Parfum': {
    old: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/perfume-bottle,fragrance/all'
  },
  
  // Broken images
  'Tommy Hilfiger Oxford Shirt': {
    old: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e23?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/mens-shirt,oxford/all'
  },
  'Levi\'s 511 Slim Fit Jeans': {
    old: 'https://images.unsplash.com/photo-1542272604-780c8d52a5ce?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/blue-jeans,denim/all'
  },
  'Clinique Moisture Surge 100H': {
    old: 'https://images.unsplash.com/photo-1611077544760-4493ceec7b6b?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/moisturizer,skincare/all'
  },
  'Philips IPL Hair Removal Device': {
    old: 'https://images.unsplash.com/photo-1556228720-1c2a468e55cd?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/epilator,device/all'
  },
  'IKEA KALLAX Shelf Unit': {
    old: 'https://images.unsplash.com/photo-1595514535415-00dbf83c135e?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/bookshelf,furniture/all'
  },
  'Estée Lauder Advanced Night Repair': {
    old: 'https://images.unsplash.com/photo-1571781926291-c477eb3af7dc?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/serum,skincare-bottle/all'
  },
  'L\'Oréal Voluminous Lash Paradise Mascara': {
    old: 'https://images.unsplash.com/photo-1512496015851-a1c848cb32f3?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/mascara,makeup/all'
  },
  'DJI Mini 4 Pro Drone': {
    old: 'https://images.unsplash.com/photo-1507582020474-9a35e7d65466?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/drone,dji/all'
  },
  'KitchenAid Artisan Stand Mixer': {
    old: 'https://images.unsplash.com/photo-1591324535489-9c78ea9a4e44?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/stand-mixer,kitchen/all'
  },
  'Eagle Creek Pack-It Specter Cubes': {
    old: 'https://images.unsplash.com/photo-1553531580-6520e780eb15?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/packing-cubes,travel/all'
  },
  'Victorinox Swiss Army Huntsman Knife': {
    old: 'https://images.unsplash.com/photo-1581453904507-626ddb717f59?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/swiss-army-knife,pocket-knife/all'
  },
  'Le Creuset Enameled Cast Iron Dutch Oven': {
    old: 'https://images.unsplash.com/photo-1584269600519-112d071b26e6?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/dutch-oven,cookware/all'
  },
  'Samsonite Proxis Spinner 75cm Luggage': {
    old: 'https://images.unsplash.com/photo-1565026057447-bc90829cebba?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/luggage,suitcase/all'
  },
  'Cabeau Evolution S3 Travel Pillow': {
    old: 'https://images.unsplash.com/photo-1563604044-672ce12d263b?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/travel-pillow,neck-pillow/all'
  },
  'Bose Noise Cancelling Headphones 700': {
    old: 'https://images.unsplash.com/photo-1546435770-a3e426fac332?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/headphones,bose/all'
  },
  'Yonex Arcsaber 11 Pro Badminton Racket': {
    old: 'https://images.unsplash.com/photo-1622279457486-640c4cb686ac?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/badminton-racket,sports/all'
  },
  'Fossil Gen 6 Smartwatch': {
    old: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800&h=800',
    new: 'https://loremflickr.com/800/800/smartwatch,fossil/all'
  }
};

for (const [name, urls] of Object.entries(replacements)) {
  if (content.includes(urls.old)) {
    content = content.replaceAll(urls.old, urls.new);
    console.log(`Replaced ${name}`);
  } else {
    console.log(`Could not find old URL for ${name}`);
  }
}

fs.writeFileSync(file, content);
console.log('Done.');
