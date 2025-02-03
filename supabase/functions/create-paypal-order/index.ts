import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface PayPalOrder {
  reward_id: string;
  amount: number;
  currency: string;
  user_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reward_id, amount, currency, user_id } = await req.json() as PayPalOrder;
    
    console.log('Creating PayPal order:', { reward_id, amount, currency, user_id });
    
    const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
    const PAYPAL_SECRET_KEY = Deno.env.get('PAYPAL_SECRET_KEY');
    
    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET_KEY) {
      console.error('PayPal credentials not configured');
      return new Response(
        JSON.stringify({ error: 'PayPal credentials not configured' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get PayPal access token
    const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!authResponse.ok) {
      console.error('PayPal auth failed:', await authResponse.text());
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate with PayPal' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authData = await authResponse.json();
    console.log('PayPal auth successful, creating order');
    
    if (!authData.access_token) {
      console.error('No access token in PayPal response:', authData);
      return new Response(
        JSON.stringify({ error: 'Invalid PayPal authentication response' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create PayPal order
    const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.access_token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description: `Reward: ${reward_id}`,
        }],
        application_context: {
          return_url: `${req.headers.get('origin')}/rewards?success=true`,
          cancel_url: `${req.headers.get('origin')}/rewards?success=false`,
        },
      }),
    });

    const orderData = await orderResponse.json();
    console.log('PayPal order response:', {
      status: orderResponse.status,
      data: orderData
    });

    if (!orderResponse.ok) {
      console.error('PayPal order creation failed:', orderData);
      return new Response(
        JSON.stringify({ 
          error: 'PayPal order creation failed', 
          details: orderData.error_description || orderData.message 
        }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(orderData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});