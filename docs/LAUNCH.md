# MVC Creations: launch checklist

## 1. Vercel environment variables (Production + Preview)
| Name | Notes |
|---|---|
| TURSO_DATABASE_URL, TURSO_AUTH_TOKEN | already set |
| STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET | webhook endpoint: `<site>/api/stripe/webhook`, event `checkout.session.completed` |
| RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL | FROM must be on a Resend-verified domain, or mail only reaches the Resend sandbox |
| ADMIN_PASSWORD | long and unique; changing it signs everyone out |
| CALENDAR_FEED_TOKEN | **new.** Random string. Feed URL becomes `<site>/api/calendar.ics?token=...`; re-subscribe in Google/Apple Calendar |
| CRON_SECRET | **new.** Random string. Vercel Cron sends it automatically; reminders run daily at 14:00 UTC (9am Central in summer) |
| NEXT_PUBLIC_SITE_URL | the live URL, no trailing slash |
| NEXT_PUBLIC_FEATURE_SHOP | leave unset. `true` brings back the shop pages and Orders in admin |

## 1b. Wire Stripe (about 10 minutes)
1. Stripe Dashboard, top-right toggle: start in **Test mode**.
2. Developers, API keys: copy the **Secret key** (`sk_test_...`) into Vercel as `STRIPE_SECRET_KEY`.
3. Developers, Webhooks, Add endpoint. URL: `<site>/api/stripe/webhook` (Admin, System shows the exact URL). Event: `checkout.session.completed` only.
4. Open the new endpoint, reveal **Signing secret** (`whsec_...`), put it in Vercel as `STRIPE_WEBHOOK_SECRET`. Redeploy.
5. Admin, System: Env Vars shows STRIPE_SECRET_KEY "TEST mode" and Webhook Health shows the endpoint enabled. Both green = wired.
6. Run section 2 below. For launch, repeat 1 to 4 in **Live mode** (new key, new endpoint, new signing secret) and replace the three Vercel values. The test and live endpoints are separate in Stripe.
7. Refunds: Admin, click the appointment, "Refund deposit" (online bookings only). Cancelling never refunds by itself, since the policy keeps deposits on late cancels.
8. Checkout links expire after 30 minutes, so a stale tab can't pay for a slot that has since been given away.

Shareable booking card: `<site>/card` (tap-to-book page), `/card/image.png` (1080x1350 story/post image), `/card/qr.png` and `/card/qr.svg` (QR to the site). All regenerate from `NEXT_PUBLIC_SITE_URL`, so they follow the custom domain automatically. To change the photo, edit `CARD_IMAGE` in `app/card/page.tsx` and `app/card/image.png/route.tsx`.

Placeholders to remove or update before launch: the "Coming soon" band (Shop, Tutorials, Merch). Delete `<ComingSoon />` in `app/page.tsx`, or set `NEXT_PUBLIC_HIDE_COMING_SOON=true`. `/shop` shows the same placeholder until the shop is real.

## 2. Deposit-to-calendar test (Stripe test mode first)
1. Open `/book`, pick Gel-X, a date and time, fill the form, pay with `4242 4242 4242 4242`.
2. Success page shows; Stripe dashboard shows a $25 payment.
3. Stripe, Developers, Webhooks: `checkout.session.completed` delivered with a 200.
4. Admin `/admin` calendar: a block on that date and time, Gel-X color, 90 minutes long.
5. Client inbox: confirmation with `.ics` attachment. Margie's inbox: new booking email.
6. Open the `.ics`: the event is at the right Central time, not 5 to 6 hours off.
7. Subscribe to `<site>/api/calendar.ics?token=...`: the booking appears at the same time.
8. Back on `/book`, same date: that time and everything overlapping it is gone.
9. Admin: click the block, Reschedule with "email" ticked. Client gets the new time; the old slot reopens.
10. Admin: Cancel with "email" ticked. Slot reopens, client gets the cancellation. Refund the deposit in Stripe by hand if owed.
11. Double booking: pay for two clients on the same slot from two browsers. The second shows red "Needs review" and Margie gets an alert email.
12. Admin Hours: block tomorrow all day; `/book` shows it unavailable.
13. Reminders: with a booking for tomorrow, call `<site>/api/cron/reminders` with header `Authorization: Bearer <CRON_SECRET>`. Client gets one email; a second call sends nothing.
14. Switch Stripe to live keys, repeat steps 1 to 5 with a real card, then refund it.

## 3. Attach a custom domain
1. Choose the domain (for example `mvccreations.com`).
2. Vercel, project, Settings, Domains, Add. Create the DNS records it shows (usually A `76.76.21.21` for the root and CNAME `cname.vercel-dns.com` for `www`).
3. Set `NEXT_PUBLIC_SITE_URL` to `https://<domain>` and redeploy.
4. Stripe: point the webhook endpoint at the new domain.
5. Resend: Domains, add it, add its DNS records, wait for Verified, then set `RESEND_FROM_EMAIL` to `Margie <book@<domain>>`.
6. Re-subscribe the calendar feed on the new domain.

Instagram bio link: the domain (or `mvc-creations.vercel.app` until then). Suggested line: `Nail artist · Kenner, LA. Book your chair ↓`

## 4. Needed from Margie
- 8 to 12 real photos of finished sets (good light, hands only, clean background) and which service each is. Drop them in `public/portfolio` and add to `lib/portfolio.ts`. Only 4 exist now.
- Confirm prices and durations (Admin, Services) and hours (Admin, Hours). Defaults follow her booking page: Mon to Sat, 9am to 6pm, Sunday closed.
- Confirm policy wording: $25 deposit, 24 hours' notice, 50% late cancel, 100% no-show, 10-minute grace. The old FAQ said 15 minutes late.
- Which email is the real inbox: the site uses mvcxcreations@gmail.com; the FAQ used to list a different address.
- A replacement press-ons photo (current one has a Gemini watermark).
- Display font: Cormorant Garamond is a stand-in until the licensed font is chosen.
