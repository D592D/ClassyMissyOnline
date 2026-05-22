import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, customerPhone } = await req.json();
    
    // In local dev, if these variables are missing, we use dummy data
    const merchantId = process.env.MMG_MERCHANT_ID || 'MOCK_MERCHANT';
    const clientId = process.env.MMG_CLIENT_ID || 'MOCK_CLIENT';
    const privateKey = process.env.MMG_PRIVATE_KEY 
      ? process.env.MMG_PRIVATE_KEY.replace(/\\n/g, '\n')
      : null;
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const payload = {
      merchantId,
      clientId,
      amount: parseFloat(amount).toFixed(2),
      currency: "GYD",
      orderId: orderId,
      customerPhone: customerPhone,
      responseUrl: `${baseUrl}/checkout/success`,
      errorUrl: `${baseUrl}/checkout/cancel`,
      notifyUrl: `${process.env.BACKEND_WP_URL || 'http://localhost:8080'}/wp-json/mmg-webhook/v1/status`
    };

    let encryptedHex = "MOCK_ENCRYPTED_DATA_BECAUSE_NO_KEY_PROVIDED";

    // Only encrypt if we have a real key configured locally
    if (privateKey) {
      const buffer = Buffer.from(JSON.stringify(payload));
      const encryptedData = crypto.publicEncrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        buffer
      );
      encryptedHex = encryptedData.toString('hex');
    }

    // Usually you'd POST this to the MMG endpoint and get a gateway URL back
    // Since this is mock/local development without a real account:
    const mockMmgGatewayUrl = `${baseUrl}/mock-mmg-gateway?payload=${encodeURIComponent(encryptedHex)}`;

    return NextResponse.json({ success: true, redirectUrl: mockMmgGatewayUrl });
  } catch (error: any) {
    console.error("MMG Handshake Error:", error);
    return NextResponse.json({ error: 'Handshake generation failed', details: error.message }, { status: 500 });
  }
}
