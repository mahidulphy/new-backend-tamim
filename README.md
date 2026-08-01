# Memory Gift Platform

Premium digital memory gift platform: QR codes, storytelling templates, and an admin dashboard.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4
- **Backend:** Express (TypeScript, single serverless entry for Vercel)
- **Database:** PostgreSQL via Prisma 7 (driver adapters)
- **Storage:** Cloudinary
- **Deployment:** Vercel (auto-deploy from GitHub `master`)

## Local Development

**Prerequisites:** Node.js, local PostgreSQL (or set `DATABASE_URL` to a hosted one)

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL`, `SESSION_SECRET`, `CLIENT_ORIGIN`, and Cloudinary keys
3. (Optional, dev only) set `DEV_BYPASS_AUTH=true` to skip the admin login screen
4. Run migrations/seed: `npm run db:push && npm run seed`
5. Start the app: `npm run dev`

The dev server runs the Vite client on `http://localhost:3000` and the API on `http://localhost:3001`.

## Scripts

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Run client (port 3000) and API (port 3001) with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | TypeScript type check |
| `npm run seed` | Seed the database with starter data |
| `npm run db:push` | Sync Prisma schema to the database |

## Deployment

Deployments are fully automated: every push to the `master` branch triggers a new
production deployment on Vercel via the GitHub integration.

```
git add .
git commit -m "message"
git push origin master
```

Environment variables are configured in the Vercel project settings (production).

## Authentication

Production requires admin login. A development-only bypass (`DEV_BYPASS_AUTH=true`)
auto-authenticates as the default admin; it is ignored when `NODE_ENV=production`.

Deployed automatically to Netlify: https://new-backend-tamim.netlify.app
