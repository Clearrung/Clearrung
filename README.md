# Clearrung — debt payoff app

A full-stack app: users sign up, add their debts, and see exactly when
they'll be debt-free under a snowball or avalanche payoff strategy.

Stack: Next.js (React) + Supabase (auth + database) + Tailwind CSS.

## 1. Create a Supabase project (free)

1. Go to https://supabase.com and create a free account.
2. Create a new project (pick any name/region).
3. Once it's ready, go to **Project settings > API**. You'll need:
   - **Project URL**
   - **anon public key**
4. Go to **SQL Editor > New query**, paste the contents of
   `supabase-schema.sql` from this project, and run it. This creates the
   `debts` table and locks it down so each user can only see their own data.
5. Go to **Authentication > Providers** and make sure **Email** is enabled
   (it is by default). Optionally turn off "Confirm email" while testing
   locally so signups work instantly.

## 2. Run it locally

```bash
npm install
cp .env.local.example .env.local
```

Open `.env.local` and paste in your Supabase URL and anon key from step 1.

```bash
npm run dev
```

Visit http://localhost:3000 — sign up, add a debt, and you should see it
in the Supabase **Table editor** under the `debts` table.

## 3. Deploy with your domain

The easiest path is **Vercel** (free tier, built for Next.js):

1. Push this project to a GitHub repo.
2. Go to https://vercel.com, sign in with GitHub, and import the repo.
3. In the Vercel project's **Environment Variables**, add the same two
   variables from `.env.local`.
4. Deploy. Vercel gives you a `*.vercel.app` URL immediately.
5. Go to **Project > Settings > Domains** and add your own domain — Vercel
   will show you the DNS records to add at your registrar (usually one
   CNAME or A record). Propagation is usually minutes to a few hours.

## What's built

- Landing page (`app/page.tsx`)
- Sign up / log in with Supabase Auth (`app/signup`, `app/login`)
- Dashboard (`app/dashboard`) — add/remove debts, toggle snowball vs
  avalanche, adjust extra monthly payment, see payoff timeline chart
- Payoff math lives in `lib/payoff.ts`, fully client-side

## Natural next features

- Log actual payments each month and track progress against the plan
- Email reminders when a payment is due
- Bank account linking (Plaid) to pull real balances automatically
- Multiple "what-if" scenarios saved and compared side by side
