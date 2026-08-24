import crypto from 'crypto';

export async function POST(req) {
  try {
    const { action, payload } = await req.json();

    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    
    // Treat placeholder 'your_test_key_id' as not configured so it seamlessly falls back to demo mode
    const isRazorpayConfigured = !!(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET && RAZORPAY_KEY_ID !== 'your_test_key_id');

    // ACTION: checkConfig
    if (action === 'checkConfig') {
      return new Response(JSON.stringify({
        razorpayAvailable: isRazorpayConfigured,
        keyId: isRazorpayConfigured ? RAZORPAY_KEY_ID : null
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ACTION: createOrder
    if (action === 'createOrder') {
      if (!isRazorpayConfigured) {
        return new Response(JSON.stringify({ error: 'Razorpay keys not configured' }), { status: 503 });
      }

      const { amount } = payload; // Amount in paise
      
      const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
      
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Math.round(amount), // ensure integer
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`
        })
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Razorpay Create Order Failed:', data);
        const errorMsg = data.error?.description || 'Failed to create Razorpay order';
        return new Response(JSON.stringify({ error: errorMsg }), { status: 502 });
      }

      return new Response(JSON.stringify({
        id: data.id,
        currency: data.currency,
        amount: data.amount
      }), { status: 200 });
    }

    // ACTION: verifyPayment
    if (action === 'verifyPayment') {
      if (!isRazorpayConfigured) {
        return new Response(JSON.stringify({ error: 'Razorpay keys not configured' }), { status: 503 });
      }

      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;
      
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generatedSignature === razorpay_signature) {
        return new Response(JSON.stringify({ success: true, message: 'Payment verified successfully' }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ success: false, error: 'Invalid signature' }), { status: 400 });
      }
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });

  } catch (error) {
    console.error('API Error in Razorpay Route:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
