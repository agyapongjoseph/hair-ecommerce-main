// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import axios from "axios";
import "dotenv/config";
const HUBTEL_API_URL = Deno.env.get("HUBTEL_API_URL")!;
const HUBTEL_MERCHANT_ID = Deno.env.get("HUBTEL_MERCHANT_ID")!;
const HUBTEL_API_KEY = Deno.env.get("HUBTEL_API_KEY")!;
console.log("Hello from Functions!");

Deno.serve(async (req) => {
  const { amount, customerName, customerEmail, customerPhone, orderId } =
    await req.json();

  try {
    // Hubtel requires headers + payload

    const response = await axios.post(
      HUBTEL_API_URL,
      {
        amount: amount,
        title: "Order Payment",
        description: `Payment for order ${orderId}`,
        clientReference: orderId,
        merchantAccountNumber: HUBTEL_MERCHANT_ID,
        customerName,
        customerEmail,
        customerMsisdn: customerPhone,
        channel: "momo", // mobile money default; can also use "card"
        primaryCallbackUrl: "http://localhost:5173/checkout-success", // replace in production
      },
      {
        headers: {
          Authorization:
            "Basic " + btoa(`${HUBTEL_MERCHANT_ID}:${HUBTEL_API_KEY}`),
          "Content-Type": "application/json",
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Payment error:", err.response?.data || err.message);
    return new Response(
      JSON.stringify({ error: "Payment initiation failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/initiate-payment' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
