

```markdown
# Mission Specification: Classy Missy Collection Storefront
**Objective:** Architect, code, and deploy a headless, high-converting e-commerce storefront utilizing a decoupled WordPress backend and a Vercel-hosted frontend framework. Transition operations seamlessly from manual WhatsApp status posts to automated mobile-first checkouts with native, free cryptographic Mobile Money Guyana (MMG) payment handling.

---

## 1. System Architecture Matrix


```

```
           [ GitHub Repository ] 
                     │
           (Push Code/Vercel Build)
                     ▼

```

[ WordPress (Backend) ] ──(GraphQL API)──► [ Vercel Frontend (Next.js/Astro) ]
• Inventory Management                     • Ultra-fast Core Web Vitals
• WPGraphQL / REST API                     • Native Cryptographic MMG Integration
• Zero-Traffic Admin Node                  • Vercel Edge Serverless Functions

```

---

## 2. Technical Stack Boundaries

*   **Frontend Engine:** Next.js 15+ (App Router) / Astro Framework (TypeScript).
*   **Backend Content Management:** WordPress (Headless Config) via WPGraphQL.
*   **Hosting & CI/CD Pipeline:** GitHub repository connected directly to Vercel.
*   **Design Framework:** Tailwind CSS v4 (Mobile-First responsive grids optimized for phone displays).
*   **Payment Infrastructure:** Native cryptographic integration with the official MMG Payment Gateway API (No licensed wrapper plugins).

---

## 3. Cryptographic Handshake: Free MMG API Integration

### Security Requirements
The agent must configure a secure runtime environment using Node's native `crypto` module. Payloads transmitted to the official MMG endpoints (`https://business.mymmg.gy`) must be securely signed using bank-grade parameters.

### RSA Signature & Hashing Standard
All transaction checkouts must compute signatures using **RSA-OAEP with a SHA-256** hashing mechanism. 
*   **Public Key:** Dispatched directly to MMG merchant servers.
*   **Private Key:** Locked securely inside Vercel’s environment settings (`process.env.MMG_PRIVATE_KEY`). **Never** store or write raw `.pem` formats into the public source files.

### Scripting Endpoint Core Implementation
Construct a Vercel Serverless Function (`/api/checkout/mmg`) that processes client cart states and formats the base handshake payload structure:

```typescript
// Architectural Outline for Vercel Serverless Hook
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, customerPhone } = await req.json();
    
    const payload = {
      merchantId: process.env.MMG_MERCHANT_ID,
      clientId: process.env.MMG_CLIENT_ID,
      amount: parseFloat(amount).toFixed(2),
      currency: "GYD",
      orderId: orderId,
      responseUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
      errorUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      notifyUrl: `${process.env.BACKEND_WP_URL}/wp-json/mmg-webhook/v1/status`
    };

    // Encrypt payload using RSA-OAEP SHA-256
    const privateKey = process.env.MMG_PRIVATE_KEY!.replace(/\\n/g, '\n');
    const buffer = Buffer.from(JSON.stringify(payload));
    const encryptedData = crypto.publicEncrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      buffer
    );

    // Call the official MMG Hosted Gateway endpoint...
    return NextResponse.json({ success: true, redirectUrl: mmgGatewayUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Handshake generation failed' }, { status: 500 });
  }
}

```

---

## 4. Operational Transition & User Experience Requirements

### The WhatsApp Traffic Funnel

* **Product URL Resolution:** The application router must resolve clean, lightning-fast specific product URLs (e.g., `/shop/product-slug`) so that sharing individual shop links via WhatsApp Status routes customers directly to a pre-filled mobile shopping cart.
* **Localization Standards:** Set the store default locale to Guyanese Dollars (GYD) text formatting.
* **Frictionless Checkouts:** Implement express checkouts alongside the primary MMG selection drawer, removing arbitrary input form friction.

### Storefront Layout Requirements

* **Slide-Out Shopping Drawer:** Implement an asynchronous persistent cart view that updates states dynamically without forcing browser refreshes.
* **Inventory Automation:** Ensure product listings communicate automatically with backend webhooks to lock purchases out if local physical stock levels hit zero items in Georgetown.

---

## 5. Agent Instructions for Execution Phase

1. **Phase I: Scaffolding** Initialize the Vercel-optimized boilerplate. Configure TypeScript declarations for the headless product payloads.
2. **Phase II: API Configurations** Write the local environment mocks for testing incoming payloads from `https://business.mymmg.gy`. Implement error status handling inside the checkout routes.
3. **Phase III: Tailoring UI** Design the responsive components focusing purely on rapid touch interactions on 390x844 viewports (mobile phone baselines).
4. **Phase IV: Automation Verification** Run comprehensive automated test assertions verifying that the final transaction callback transitions individual inventory tallies correctly from "On Hold" to "Paid."

```

