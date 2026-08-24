import { PRODUCTS } from './products';

// Stop words to remove from query before keyword matching
const STOP_WORDS = new Set([
  'i', 'need', 'want', 'looking', 'for', 'a', 'an', 'the', 'some', 'any',
  'with', 'and', 'or', 'that', 'has', 'have', 'is', 'are', 'in', 'on', 'at',
  'to', 'show', 'me', 'find', 'help', 'choose', 'good', 'best', 'cheap',
  'under', 'below', 'less', 'than', 'then', 'max', 'price', 'budget', 'rupees', 'rs',
  'give', 'products', 'prodcuts', 'items', 'something', 'things', 'more', 'can', 'you', 'please', 'like', 'around'
]);

// Categories map for intent parsing
const CATEGORIES = {
  'electronics': ['electronics', 'tech', 'gadget', 'laptop', 'macbook', 'phone', 'smartphone', 'earbuds', 'headphones', 'camera', 'ipad', 'tablet'],
  'fashion': ['fashion', 'clothes', 'clothing', 'shoes', 'sneakers', 'shirt', 'jeans', 'wear', 'watch', 'smartwatch'],
  'beauty': ['beauty', 'skincare', 'makeup', 'hair', 'serum', 'dryer', 'trimmer'],
  'home-kitchen': ['home', 'kitchen', 'cooking', 'appliance', 'vacuum', 'fryer', 'coffee', 'shelf', 'furniture'],
  'sports': ['sports', 'fitness', 'workout', 'gym', 'yoga', 'mat', 'dumbbells', 'tracker', 'racket', 'badminton'],
  'travel': ['travel', 'luggage', 'bag', 'backpack', 'suitcase', 'charger', 'powerbank', 'drone']
};

/**
 * Parses the natural language query to extract intent (budget, keywords).
 */
function parseIntent(query) {
  const intent = {
    maxPrice: null,
    minRating: null,
    keywords: [],
    categories: new Set()
  };

  const lowerQuery = query.toLowerCase().replace(/[^\w\s₹,]/g, ' ');

  // Extract budget
  // match "under 3000", "under ₹3,000", "below 5000", "less than 2000", "less then 2000"
  const priceRegex = /(?:under|below|less than|less then|cheaper than|max|budget)\s*(?:of\s*)?(?:rs\.?|₹)?\s*(\d+(?:,\d+)*)/i;
  const priceMatch = query.match(priceRegex);
  if (priceMatch) {
    intent.maxPrice = parseInt(priceMatch[1].replace(/,/g, ''), 10);
  }

  // Extract rating
  const ratingRegex = /(?:rating|rated)\s*(?:above|over|>)?\s*(\d(?:\.\d)?)/i;
  const ratingMatch = query.match(ratingRegex);
  if (ratingMatch) {
    intent.minRating = parseFloat(ratingMatch[1]);
  }

  // Tokenize and find keywords & categories
  const tokens = lowerQuery.split(/\s+/).filter(t => t.length > 2);
  
  for (const token of tokens) {
    if (!STOP_WORDS.has(token) && !token.match(/^\d+$/)) {
      intent.keywords.push(token);
      
      // Check if token matches a category
      for (const [cat, synonyms] of Object.entries(CATEGORIES)) {
        if (synonyms.some(syn => syn.includes(token) || token.includes(syn))) {
          intent.categories.add(cat);
        }
      }
    }
  }

  return intent;
}

/**
 * Scores a product against the intent.
 */
function scoreProduct(product, intent) {
  let score = 0;
  
  const searchString = `
    ${product.name.toLowerCase()} 
    ${product.description.toLowerCase()} 
    ${product.category.toLowerCase()} 
    ${product.features.join(' ').toLowerCase()}
  `;

  // Category boost
  if (intent.categories.has(product.category)) {
    score += 10;
  }

  // Keyword matching
  let matchedKeywords = 0;
  for (const keyword of intent.keywords) {
    if (searchString.includes(keyword)) {
      score += 3;
      matchedKeywords++;
      
      // Extra boost if keyword is in the name
      if (product.name.toLowerCase().includes(keyword)) {
        score += 5;
      }
    }
  }

  // If no keywords matched and there are keywords, score is heavily penalized
  if (intent.keywords.length > 0 && matchedKeywords === 0 && !intent.categories.has(product.category)) {
    return 0; // Not relevant at all
  }

  // Rating boost
  if (intent.minRating && product.rating >= intent.minRating) {
    score += 5;
  }
  
  // High rating generally gets a small boost to break ties
  score += product.rating;

  return score;
}

/**
 * Processes a natural language query and returns products and a response message.
 */
export function processQuery(query) {
  const lowerQuery = query.toLowerCase().trim();
  
  // 1. Check for basic greetings or general questions
  const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
  const helpQuestions = ['who are you', 'what can you do', 'help', 'who are you?', 'what can you do?', 'help?'];

  if (greetings.includes(lowerQuery)) {
    return {
      text: "Hello! I'm MerchantFlow AI. I can help you discover products, compare options, find products within your budget, and build your cart.",
      products: []
    };
  }

  if (helpQuestions.includes(lowerQuery)) {
    return {
      text: "I am MerchantFlow AI, your personal shopping assistant. I can help you discover products, compare options, find products within your budget, and build your cart. Just ask me what you're looking for!",
      products: []
    };
  }

  const intent = parseIntent(query);
  
  // Fallback for empty/unrecognized queries
  if (intent.keywords.length === 0 && intent.categories.size === 0 && !intent.maxPrice) {
    return {
      text: "I can help you find products! Try asking for something specific like 'wireless earbuds under ₹3,000' or 'running shoes'.",
      products: PRODUCTS.slice(0, 3) // Just show featured
    };
  }

  const scoredProducts = [];
  const outOfBudgetProducts = [];

  for (const product of PRODUCTS) {
    // Only consider in-stock products
    if (!product.inStock) continue;

    const score = scoreProduct(product, intent);
    
    if (score > 2) { // Minimum relevance threshold
      if (intent.maxPrice && product.price > intent.maxPrice) {
        // Highly relevant but out of budget
        outOfBudgetProducts.push({ product, score });
      } else {
        // Relevant and in budget
        scoredProducts.push({ product, score });
      }
    }
  }

  // Sort both arrays by score descending
  scoredProducts.sort((a, b) => b.score - a.score);
  outOfBudgetProducts.sort((a, b) => b.score - a.score);

  // Exact matches found
  if (scoredProducts.length > 0) {
    const topProducts = scoredProducts.slice(0, 4).map(p => p.product);
    
    let text = "Here are the best matches I found";
    if (intent.maxPrice) text += ` within your budget of ₹${intent.maxPrice.toLocaleString('en-IN')}`;
    text += ".";

    return { text, products: topProducts };
  }

  // No exact matches, but out of budget matches found
  if (outOfBudgetProducts.length > 0) {
    const topProducts = outOfBudgetProducts.slice(0, 3).map(p => p.product);
    
    let text = "I couldn't find an exact match";
    if (intent.maxPrice) text += ` under ₹${intent.maxPrice.toLocaleString('en-IN')}`;
    text += ", but these options are highly relevant though slightly above your budget.";

    return { text, products: topProducts };
  }

  // No matches at all
  return {
    text: "I couldn't find any products matching your exact request. Could you try describing it differently?",
    products: []
  };
}
