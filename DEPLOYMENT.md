# Deploying UniShop to Vercel

UniShop is one Next.js project in `client/`: the UI uses the App Router and the existing marketplace endpoints run from `/api/[[...path]]`. There is no separately deployed backend service.

## Important SQLite limitation

SQLite is supported for local development. Vercel functions do **not** provide persistent writable storage, so production functions use an SQLite copy in `/tmp`. A newly started function receives a migrated empty database; users, listings, wishlists, and reports can disappear whenever an instance restarts or a new instance serves a request.

This configuration is useful for previews or demos only. A real marketplace needs a persistent managed database before a production launch.

## Deploy to Vercel

1. Import the repository into Vercel.
2. Set the **Root Directory** to `client`.
3. Add these environment variables:

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | `file:/tmp/unishop.db` for Vercel's ephemeral SQLite runtime. |
| `JWT_SECRET` | Yes | A long, unique random secret. |
| `JWT_EXPIRES_IN` | No | Defaults to `30d`. |
| Cloudinary variables | For uploads | Required for listing photos. |

`vercel.json` runs the build command. It migrates a clean SQLite template at build time; each Vercel function copies that template to `/tmp` on first use.

Deploy from Vercel or run:

```bash
cd client
npx vercel --prod
```

The app is at the Vercel deployment URL and APIs retain their existing paths, such as `/api/products`, `/api/auth/login`, and `/api/admin/stats`. Health is at `/api/health`.

## Local development

```powershell
cd client
Copy-Item .env.example .env
# Set JWT_SECRET and Cloudinary values as needed.
npm install
npm run db:deploy
npm run dev
```

Local SQLite data is stored at `client/server/prisma/dev.db` and remains available between local restarts.
