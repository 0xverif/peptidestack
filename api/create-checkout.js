const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRODUCTS = {
  basic: {
    name: 'PeptideStack Basic',
    description: 'Single-phase protocol with safety guidelines',
    price: 4900, // cents
  },
  complete: {
    name: 'PeptideStack Complete',
    description: 'Full 3-phase protocol with implementation guide',
    price: 7900,
  },
  concierge: {
    name: 'PeptideStack Concierge',
    description: 'Complete protocol + consultation + support',
    price: 24900,
  },
};

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tier, answers, email } = req.body;

    if (!tier || !PRODUCTS[tier]) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    if (!answers || !email) {
      return res.status(400).json({ error: 'Missing answers or email' });
    }

    const product = PRODUCTS[tier];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin || 'https://peptidestack.vercel.app'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://peptidestack.vercel.app'}/#pricingSection`,
      metadata: {
        tier,
        answers: JSON.stringify(answers),
      },
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: error.message });
  }
};
