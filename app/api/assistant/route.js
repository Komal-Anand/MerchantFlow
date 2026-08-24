import { PRODUCTS } from '@/lib/products';

export async function POST(req) {
  try {
    console.log('[Assistant API] Request received');
    const { query } = await req.json();
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`[Assistant API] API key configured: ${!!apiKey}`);
    
    if (!apiKey) {
      console.warn('[Assistant API] GEMINI_API_KEY is not configured in .env.local. Falling back to rules-based search.');
      return new Response(JSON.stringify({ error: 'LLM Key missing' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Filter down the product data sent to the model to minimize token overhead
    const minimalProducts = PRODUCTS.filter(p => p.inStock).map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      rating: p.rating,
      description: p.description,
      features: p.features
    }));

    const systemInstruction = `You are a helpful, professional, and friendly AI Shopping Assistant for the MerchantFlow store.
Your goal is to understand customer queries and recommend the best products from our catalog.

Here is the exact catalog of available products (do not recommend anything outside of this list):
${JSON.stringify(minimalProducts, null, 2)}

Strict Guidelines:
1. You must ONLY recommend product IDs that exist in the provided catalog.
2. Never invent, hallucinate, or alter any product names, prices, ratings, features, stock status, or IDs.
3. Recommend up to 4 most relevant products based on the customer's budget, category requirements, or preferences.
4. If a customer specifies a budget (e.g. "under ₹3,000"), prioritize products under that budget.
5. If no products fit within the budget, relax the constraint, recommend the closest options slightly above their budget, and explain this gracefully.
6. The user can add recommended products to their cart, so make sure to select accurate product IDs.
7. Return your response strictly as a JSON object matching this schema:
{
  "text": "Your helpful response explanation to the user explaining why you recommended these specific products.",
  "productIds": ["id1", "id2"]
}
8. IMPORTANT: If the user just says "hello", "hi", "who are you", or asks a general question, introduce yourself properly as MerchantFlow AI and return an empty array for productIds. Do not invent products for greetings.`;

    console.log('[Assistant API] Gemini request started');
    // Direct REST fetch to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `User request: "${query}"` }]
            }
          ],
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Assistant API] Gemini API returned error status:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'LLM Service error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('[Assistant API] Gemini response received');
    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      console.error('[Assistant API] Empty response from Gemini API');
      return new Response(JSON.stringify({ error: 'Empty LLM response' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse the JSON returned by Gemini
    let result;
    try {
      result = JSON.parse(responseText);
      console.log('[Assistant API] Response parsed successfully');
    } catch (parseError) {
      console.error('[Assistant API] Failed to parse Gemini response as JSON');
      return new Response(JSON.stringify({ error: 'Invalid response format' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Sanitize product IDs - make sure they actually exist in PRODUCTS catalog
    const validIds = Array.isArray(result.productIds) ? result.productIds.filter(id => PRODUCTS.some(p => p.id === id)) : [];
    result.productIds = validIds;

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Assistant API] Error in assistant API route:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
