# Monetization Guide

How to activate paid subscriptions and affiliate revenue.

---

## Part 1 — Stripe (Pro subscriptions)

### Overview

The subscription system is fully built on the backend (`lib/subscription.ts`, `supabase/migrations/003_subscriptions.sql`). The only missing piece is the payment flow: a Stripe Checkout session that charges the user and writes to the `subscriptions` table.

### Step 1 — Create a Stripe account

Sign up at [stripe.com](https://stripe.com). Use **Test mode** while building, switch to **Live mode** when ready.

### Step 2 — Create a product and price

In Stripe Dashboard → Products → **Add product**:
- Name: `Driftplan Pro`
- Pricing model: **Recurring**
- Price: e.g. `$9.00 / month` or `₹499 / month`
- Click Save product

Copy the **Price ID** — it looks like `price_1ABC123defGHI456`.

### Step 3 — Add env vars

In your `.env.local` (and in Vercel for production):

```env
STRIPE_SECRET_KEY=sk_test_...          # Use sk_live_... in production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...        # You get this in Step 5
STRIPE_PRICE_ID=price_1ABC123defGHI456
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4 — Install Stripe SDK

```bash
npm install stripe @stripe/stripe-js
```

### Step 5 — Create the checkout API route

Create `app/api/stripe/checkout/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    customer_email: user.email,
    metadata: { userId: user.id },
  });

  return NextResponse.json({ url: session.url });
}
```

### Step 6 — Create the webhook route

Create `app/api/stripe/webhook/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession;
    const userId = session.metadata?.userId;
    const subscriptionId = session.subscription as string;

    if (userId && subscriptionId) {
      await sb.from('subscriptions').upsert({
        user_id: userId,
        plan: 'pro',
        status: 'active',
        payment_ref: subscriptionId,
        started_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    await sb.from('subscriptions')
      .update({ status: 'cancelled', expires_at: new Date(sub.current_period_end * 1000).toISOString() })
      .eq('payment_ref', sub.id);
  }

  return NextResponse.json({ received: true });
}
```

### Step 7 — Wire up the pricing page button

In `app/pricing/page.tsx`, replace the `TODO_PAYMENT_LINK` button with:

```typescript
'use client';
import { useState } from 'react';

function UpgradeButton() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    const res = await fetch('/api/stripe/checkout', { method: 'POST' });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setLoading(false);
  };

  return (
    <button onClick={handleUpgrade} disabled={loading}
      className="w-full py-3 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition-colors disabled:opacity-60">
      {loading ? 'Redirecting...' : 'Upgrade to Pro →'}
    </button>
  );
}
```

### Step 8 — Register the Stripe webhook

1. In Stripe Dashboard → Developers → **Webhooks** → Add endpoint
2. URL: `https://yourdomain.vercel.app/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.deleted`
4. Copy the **Signing secret** → this is your `STRIPE_WEBHOOK_SECRET`

For local testing, use the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Part 2 — Affiliate links

The app has affiliate link placeholders throughout the codebase, all marked with `TODO_AFFILIATE_TAG`. Search for them:

```bash
grep -r "TODO_AFFILIATE_TAG" .
```

### Current affiliate placements

| Partner | Where | Replace with |
|---------|-------|-------------|
| Booking.com | `components/monetization/AffiliateSidebar.tsx`, destination pages | Your `aid=` parameter |
| Agoda | `lib/affiliates.ts` | Your `cid=` parameter |
| Hostelworld | `lib/affiliates.ts` | Your affiliate ID |
| GetYourGuide | `lib/affiliates.ts`, destination pages | Your `partner_id=` |
| Viator | `lib/affiliates.ts` | Your `pid=` parameter |
| Klook | `lib/affiliates.ts` | Your affiliate code |
| Airalo (eSIM) | `components/monetization/AffiliateSidebar.tsx` | Your referral code |
| WorldNomads (insurance) | `components/monetization/AffiliateSidebar.tsx` | Your affiliate link |
| Skyscanner | Destination pages | Your `associateid=` parameter |
| Amazon | `components/monetization/AffiliateSidebar.tsx` | Your Amazon Associates tag |

### How to sign up

- **Booking.com:** [partner.booking.com](https://partner.booking.com)
- **Agoda:** [partners.agoda.com](https://partners.agoda.com)
- **GetYourGuide:** [partner.getyourguide.com](https://partner.getyourguide.com)
- **Viator:** [partner.viator.com](https://partner.viator.com)
- **Skyscanner:** [partners.skyscanner.net](https://partners.skyscanner.net)
- **Airalo:** [airalo.com/referral](https://www.airalo.com/referral)
- **Amazon Associates:** [affiliate-program.amazon.com](https://affiliate-program.amazon.com)

### Tracking

Affiliate clicks are tracked in the `affiliate_clicks` table automatically. You can query it to see which partners convert:

```sql
select platform, count(*) as clicks, count(user_id) as logged_in_clicks
from affiliate_clicks
group by platform
order by clicks desc;
```

---

## Part 3 — Price alerts (future revenue)

Price alerts are stored in `price_alerts` table. The email template is built in `lib/emails/priceAlert.tsx`. What's missing is the cron job that checks prices.

To implement this:

1. Sign up for a flight/hotel price API (Amadeus, Skyscanner API, or Aviasales)
2. Create a Vercel cron job (or use a free service like Upstash QStash):

   In `vercel.json`:
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/check-prices",
         "schedule": "0 * * * *"
       }
     ]
   }
   ```

3. Create `app/api/cron/check-prices/route.ts` that:
   - Fetches active price alerts from the database
   - Checks current prices via the flight/hotel API
   - If `currentPrice < targetPrice`, sends email via Resend using `PriceAlertEmail` template
   - Optionally marks the alert as triggered

---

## Revenue estimate (rough)

| Stream | How | Potential |
|--------|-----|-----------|
| Pro subscriptions | $9/month per user | $900/month at 100 users |
| Booking.com affiliate | ~4% commission on hotel bookings | Varies by volume |
| GetYourGuide affiliate | 8% commission on activities | Varies by volume |
| Skyscanner | CPA per flight booking | ~$1–3 per conversion |
| Airalo eSIM | 10% per eSIM sale | ~$1–2 per conversion |
</content>
</invoke>