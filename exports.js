
export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'home-kitchen', name: 'Home & Kitchen' },
  { id: 'sports', name: 'Sports' },
  { id: 'travel', name: 'Travel' }
];

export const PRICE_RANGES = [
  { id: 'under-1000', name: 'Under ₹1,000', min: 0, max: 1000 },
  { id: '1000-5000', name: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
  { id: '5000-10000', name: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { id: 'over-10000', name: 'Over ₹10,000', min: 10000, max: Infinity }
];

export const SORT_OPTIONS = [
  { id: 'featured', name: 'Featured' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'rating', name: 'Highest Rated' }
];

export function filterProducts(products, filters) {
  return products.filter(p => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.minPrice && p.price < filters.minPrice) return false;
    if (filters.maxPrice && p.price > filters.maxPrice) return false;
    if (filters.query && !p.name.toLowerCase().includes(filters.query.toLowerCase()) && !p.description.toLowerCase().includes(filters.query.toLowerCase())) return false;
    return true;
  });
}

export function sortProducts(products, sort) {
  const sorted = [...products];
  if (sort === 'price-low') sorted.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') sorted.sort((a, b) => b.price - a.price);
  if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
  return sorted;
}
