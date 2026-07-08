import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { type, data } = req.body;

    if (type !== 'payment') {
      return res.status(200).json({ received: true, skipped: true });
    }

    const paymentId = data?.id;
    if (!paymentId) {
      return res.status(400).json({ error: 'No payment ID' });
    }

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
      }
    });

    const payment = await response.json();

    if (!response.ok) {
      console.error('MP payment fetch error:', payment);
      return res.status(500).json({ error: 'Failed to fetch payment' });
    }

    console.log(`Payment ${paymentId} status: ${payment.status}`);

    if (supabase && payment.external_reference) {
      try {
        await supabase.from('orders').upsert({
          external_reference: payment.external_reference,
          mp_payment_id: String(paymentId),
          status: payment.status,
          total: payment.transaction_amount,
          method: payment.payment_method_id,
          updated_at: new Date().toISOString()
        }, { onConflict: 'external_reference' });
      } catch (err) {
        console.error('Supabase order save error:', err);
      }
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}
