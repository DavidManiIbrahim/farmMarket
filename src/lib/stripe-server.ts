import { supabase } from '@/integrations/supabase/client';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil'
});

export const createStripeSession = async (items: any[], buyerId: string) => {
  try {
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/cart`,
      metadata: {
        buyerId,
        cartItems: JSON.stringify(items)
      }
    });

    return session;
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    throw error;
  }
};
