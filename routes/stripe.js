/** @format */

const express = require('express');
const Stripe = require('stripe');

require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
          images: [item.imageURL],
        },
        unit_amount: item.price * 100,
      },
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
      },
      quantity: item.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/canceled`,
  });

  res.send({ url: session.url });
});

module.exports = router;
