'use client';

import { useState, useRef, useEffect } from 'react';
import { PRODUCTS } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import styles from './page.module.css';

const SUGGESTED_PROMPTS = [
  "Find wireless earbuds under ₹3,000",
  "Help me choose a laptop for college",
  "Show me running shoes under ₹5,000",
  "Find a travel backpack"
];

import { processQuery } from '@/lib/assistantService';

export default function AssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    // Add user message
    const newMsg = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Call Gemini API Route
    fetch('/api/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: text })
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server returned error status: ${res.status}`);
        }
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }

        // Map product IDs back to the actual catalogue objects
        const recommendedProducts = (data.productIds || [])
          .map(id => PRODUCTS.find(p => p.id === id))
          .filter(Boolean);

        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            text: data.text,
            products: recommendedProducts,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
      })
      .catch((err) => {
        console.warn('AI Assistant API call failed or key is missing. Falling back to local rules-based engine.', err);
        setIsFallbackMode(true);

        // Falling back to rules-based processQuery
        const response = processQuery(text);
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            text: response.text,
            products: response.products,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        
        {/* Subtle AI Status */}
        <div className={styles.statusHeader}>
          {isFallbackMode ? (
            <span className={styles.statusOffline} title="Failsafe: rules-based catalog searching active">Local Assistant (Standard Mode)</span>
          ) : (
            <span className={styles.statusOnline} title="Powered by Gemini LLM server-side integration">Gemini AI Active</span>
          )}
        </div>

        {/* If no messages, show welcome state */}
        {messages.length === 0 && (
          <div className={styles.headerArea}>
            <h1 className={styles.title}>What are you looking for today?</h1>
            <p className={styles.subtitle}>
              Describe what you need naturally. I can help you find products, compare features, and check stock.
            </p>
          </div>
        )}

        {/* Conversation Area */}
        <div className={styles.conversation} aria-live="polite">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.messageWrapperUser : styles.messageWrapperAssistant}`}
            >
              <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleAssistant}`}>
                {msg.text}
              </div>
              <span className={styles.timestamp}>{msg.timestamp}</span>

              {/* Product Recommendations inside Assistant Message */}
              {msg.products && msg.products.length > 0 && (
                <div className={styles.recommendationsRow}>
                  {msg.products.map(product => (
                    <div key={product.id} className={styles.recCard}>
                      <ProductCard product={product} onClick={setSelectedProduct} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className={`${styles.messageWrapper} ${styles.messageWrapperAssistant}`}>
              <div className={styles.typingIndicator} aria-label="MerchantFlow is thinking">
                MerchantFlow is thinking
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={styles.inputArea}>
          <div className={styles.inputInner}>
            
            {/* Suggested Prompts (only show if no messages) */}
            {messages.length === 0 && (
              <div className={styles.suggestions} aria-label="Suggested prompts">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button 
                    key={i} 
                    className={styles.suggestionChip}
                    onClick={() => handleSend(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <div className={styles.inputForm}>
              <textarea
                className={styles.textInput}
                placeholder="Ask me to find products, compare options..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                aria-label="Message to AI Assistant"
              />
              <button 
                className={styles.sendBtn}
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Reusing existing Product Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}
