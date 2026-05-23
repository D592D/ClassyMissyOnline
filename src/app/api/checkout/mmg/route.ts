import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';

// --- Input validation schema ---
const CheckoutSchema = z.object({
  amount: z.number().positive().max(10_000_000), // max ~GYD 10M
  // Accept Guyanese mobile numbers: 7-digit after optional +592 prefix
  customerPhone: z.string().regex(
    /^(?:\+?592)?[6-7]\d{6}$/,
    'Must be a valid Guyanese mobile number (e.g. 6001234 or 5926001234)'
  ),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { amount, customerPhone, items } = parsed.data;
    // Always generate a server-side collision-safe order ID
    const orderId = `ORD-${crypto.randomUUID()}`;

    const merchantId = process.env.MMG_MERCHANT_ID || 'MOCK_MERCHANT';
    const clientId   = process.env.MMG_CLIENT_ID   || 'MOCK_CLIENT';
    const baseUrl    = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Insert pending order into Supabase
    if (supabaseAdmin) {
      const { error: dbError } = await supabaseAdmin
        .from('orders')
        .insert({
          id: orderId,
          amount,
          customer_phone: customerPhone,
          items,
          status: 'pending',
        });

      if (dbError) {
        console.error('Failed to log order to Supabase:', dbError);
        return NextResponse.json(
          { error: 'Failed to create order record' },
          { status: 500 }
        );
      }
    } else {
      console.warn('Supabase Admin Client not initialized. Order not recorded in database.');
    }

    // MMG_PUBLIC_KEY = the PUBLIC key issued BY MMG to you (their public cert).
    // You encrypt with it; MMG decrypts with their private key on their server.
    // NEVER store or use a private key here.
    const mmgPublicKey = process.env.MMG_PUBLIC_KEY
      ? process.env.MMG_PUBLIC_KEY.replace(/\\n/g, '\n')
      : null;

    const payload = {
      merchantId,
      clientId,
      amount: parseFloat(String(amount)).toFixed(2),
      currency: 'GYD',
      orderId,
      customerPhone,
      responseUrl: `${baseUrl}/checkout/success`,
      errorUrl:    `${baseUrl}/checkout/cancel`,
      notifyUrl:   `${baseUrl}/api/checkout/webhook/mmg`,
    };

    let encryptedHex = 'MOCK_ENCRYPTED_PAYLOAD_NO_KEY_CONFIGURED';

    if (mmgPublicKey) {
      // Correct: encrypt with MMG's PUBLIC key so only MMG can decrypt it
      const buffer = Buffer.from(JSON.stringify(payload));
      const encryptedData = crypto.publicEncrypt(
        {
          key: mmgPublicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        buffer
      );
      encryptedHex = encryptedData.toString('hex');
    }

    // In production: POST encryptedHex to the MMG hosted gateway endpoint
    // and return the gateway redirect URL they send back.
    const redirectUrl = mmgPublicKey
      ? `${process.env.MMG_GATEWAY_URL}?payload=${encodeURIComponent(encryptedHex)}`
      : `${baseUrl}/mock-mmg-gateway?payload=${encodeURIComponent(encryptedHex)}`;

    return NextResponse.json({ success: true, redirectUrl, orderId });
  } catch (error: any) {
    console.error('MMG Handshake Error:', error);
    return NextResponse.json(
      {
        error: 'Handshake generation failed',
        // Only expose details in development — never leak in production
        ...(process.env.NODE_ENV === 'development' && { details: error.message }),
      },
      { status: 500 }
    );
  }
}
