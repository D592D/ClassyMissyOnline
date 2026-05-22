# Classy Missy Collection Storefront

Mobile-first e-commerce storefront for Classy Missy utilizing a headless WordPress approach (mocked for local development) and a custom Vercel Next.js frontend with native MMG payment integration.

## Local Development Setup

To spin up the local development server:

1. **Install Dependencies**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Run the Development Server**
   Start the Next.js app locally on port 3000:
   ```bash
   npm run dev
   ```

3. **View the Store**
   Open your browser and navigate to:
   [http://127.0.0.1:3000](http://127.0.0.1:3000) (or http://localhost:3000)

## Features Included
- **Express Shopping Cart:** Mobile-optimized, slide-out cart drawer with instant state updates.
- **MMG Gateway Mock:** Local handshake mock in `/api/checkout/mmg` that outputs an RSA-OAEP SHA-256 payload pattern. Simulates checkout via a custom `/mock-mmg-gateway` route.
- **Headless Ready:** Architecture is separated allowing easy swapping of `mockData.ts` to `WPGraphQL` queries when the CMS goes live.
