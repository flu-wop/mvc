# Deploying MVC Creations

See `docs/LAUNCH.md` for the full launch checklist (env vars, domain, Stripe, tests).

Quick version: Vercel auto-deploys `main`. Every other branch gets a preview URL.
Database tables are created and migrated automatically on first request; `db/migrations/001_scheduling.sql` is the same migration for running by hand.
