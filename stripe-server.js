// server.js - Your Stripe Payment Server
// This handles checkout sessions securely

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your SECRET key (sk_test_...)
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allow requests from your website

// Create checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, quantity } = req.body;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: 'https://retaaustralia.netlify.app/success.html', // Replace with your domain
      cancel_url: 'https://retaaustralia.netlify.app/index.html',   // Replace with your domain
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'], // Add countries you ship to
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Stripe payment server is running!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
