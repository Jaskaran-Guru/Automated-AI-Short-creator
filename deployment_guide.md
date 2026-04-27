# Virail Deployment Guide

This guide covers how to deploy the Virail AI Short Creator to production.

## 1. Prerequisites

- **Next.js**: Hosted on [Vercel](https://vercel.com).
- **PostgreSQL**: Managed on [Supabase](https://supabase.com) or [Railway](https://railway.app).
- **Authentication**: [Clerk](https://clerk.com).
- **Storage**: [Cloudflare R2](https://www.cloudflare.com/products/r2/).
- **Payments**: [Stripe](https://stripe.com).
- **AI**: [OpenAI API](https://openai.com).

## 2. Environment Variables

Set the following variables in Vercel:

```bash
# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Database
DATABASE_URL=...

# Storage (R2)
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_ENDPOINT=...

# AI
OPENAI_API_KEY=...

# Payments
STRIPE_API_KEY=...
STRIPE_WEBHOOK_SECRET=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
```

## 3. Database Migration

Run the following command to push your schema to the production database:

```bash
npx prisma db push
```

## 4. FFmpeg Requirements

If you are running the video processing inside Next.js API routes on Vercel, you will need a specialized runtime that includes FFmpeg (e.g., `vercel-ffmpeg`). 

**Recommended Architecture**: 
For long-running video tasks, it is better to offload processing to a dedicated worker on **Railway** or **Render** that has FFmpeg pre-installed.

### Worker Setup (Railway)
1. Link your repo to Railway.
2. Add a `Dockerfile` that installs `ffmpeg` and starts a Node.js/Python consumer.
3. Use a queue (Redis) to communicate between Next.js and the Worker.

## 5. Stripe Webhooks

Set up your Stripe webhook to point to `https://your-domain.com/api/webhook/stripe`.
Ensure you listen for:
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `customer.subscription.deleted`
