# Melior Fitness — Production Deployment Checklist

## Pre-Deployment

### Environment Variables (Vercel → Settings → Environment Variables)

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Melior Fitness

# Stripe (activate when ready)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Trainer WhatsApp
NEXT_PUBLIC_WHATSAPP_VISHAL=+91XXXXXXXXXX
NEXT_PUBLIC_WHATSAPP_SHARON=+91XXXXXXXXXX
```

### Supabase Configuration

1. **Authentication → URL Configuration:**
   - Site URL: `https://your-domain.com`
   - Redirect URLs: `https://your-domain.com/auth/callback`

2. **Run all 3 migrations in SQL Editor (in order):**
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_storage.sql`

3. **Run additional column migrations:**
   ```sql
   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS medical_conditions TEXT;
   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_level TEXT;
   ALTER TABLE coaching_requests ADD COLUMN IF NOT EXISTS service_type TEXT;
   ALTER TABLE coaching_requests ADD COLUMN IF NOT EXISTS preferred_contact TEXT DEFAULT 'whatsapp';
   ALTER TABLE coaching_requests ADD COLUMN IF NOT EXISTS timeline TEXT;
   ALTER TABLE coaching_requests ADD COLUMN IF NOT EXISTS challenges TEXT;
   ALTER TABLE coaching_requests ADD COLUMN IF NOT EXISTS trainer_slug TEXT;
   ALTER TABLE coaching_requests ALTER COLUMN trainer_id DROP NOT NULL;
   ALTER TABLE diet_plans ADD COLUMN IF NOT EXISTS document_path TEXT;
   ```

4. **Set admin account:**
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```

5. **Create trainer accounts** (see `supabase/seed.sql` for full instructions)

### Stripe Configuration

1. Create products and prices in Stripe Dashboard
2. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Subscribe to events:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `checkout.session.expired`
   - `charge.refunded`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### PDF Plans Setup

1. Go to **Supabase → Storage → plan-documents**
2. Create folder `{plan_uuid}/` for each plan
3. Upload `plan.pdf` inside each folder
4. Set `document_path = '{uuid}/plan.pdf'` in the `diet_plans` table

---

## Security Checklist (OWASP Top 10)

| # | Risk | Status | Notes |
|---|------|--------|-------|
| A01 | Broken Access Control | ✅ | RBAC via proxy + layout guards + API role checks |
| A02 | Cryptographic Failures | ✅ | HTTPS enforced, Supabase/Stripe handle crypto |
| A03 | Injection | ✅ | Supabase parameterized queries, Zod input validation |
| A04 | Insecure Design | ✅ | Price from DB only, no client-trust for payments |
| A05 | Security Misconfiguration | ✅ | CSP + security headers in next.config.ts |
| A06 | Vulnerable Components | ⚠️ | Run `npm audit` before each deploy |
| A07 | Auth Failures | ✅ | Supabase JWT, session refresh in proxy |
| A08 | Data Integrity | ✅ | Stripe webhook signature verification |
| A09 | Logging | ✅ | Structured logger in `/src/lib/logger.ts` |
| A10 | SSRF | ✅ | No external URL fetching from user input |

---

## Security Headers Applied

| Header | Value |
|--------|-------|
| Content-Security-Policy | Restricts scripts/styles/frames to known domains |
| X-Frame-Options | DENY — prevents clickjacking |
| X-Content-Type-Options | nosniff — prevents MIME sniffing |
| Strict-Transport-Security | 1 year, includeSubDomains, preload |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | Blocks camera, microphone, geolocation |

---

## Performance

- `X-Powered-By` header removed
- Images optimised: AVIF + WebP formats, lazy loading
- `lucide-react` + `framer-motion` tree-shaken via `optimizePackageImports`
- Rate limiting on checkout API (5 req/min per IP)
- All public plan/trainer pages are SSG — instant loads

---

## Monitoring (Recommended)

| Tool | Purpose | Free Tier |
|------|---------|-----------|
| Vercel Analytics | Real user metrics | ✅ |
| Sentry | Error tracking | ✅ (5k events/month) |
| Upstash | Redis rate limiting | ✅ (10k req/day) |
| Axiom | Log management | ✅ (1GB/month) |

---

## Deployment Steps

```bash
# 1. Push to GitHub (triggers Vercel auto-deploy)
git push origin main

# 2. Or deploy manually
npx vercel --prod
```

### Post-Deploy Verification

- [ ] Visit homepage — loads correctly
- [ ] Sign up with a test email — confirmation arrives
- [ ] Complete onboarding — data saved in Supabase
- [ ] Visit /plans — plans load
- [ ] Visit /coaching — form works
- [ ] Admin login → /admin — data visible
- [ ] Check security headers: https://securityheaders.com
- [ ] Check Lighthouse score: target 90+ Performance, 100 Accessibility
