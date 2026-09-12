# Deploying UniShop to Vercel with Supabase

UniShop is one Next.js project in `client/`: the UI uses the App Router and the marketplace endpoints run from `/api/[[...path]]`. Prisma stores application data in Supabase PostgreSQL.

## Supabase database setup

1. Create a Supabase project. The committed PostgreSQL migration is intended for a fresh application database.
2. In the dashboard, open **Connect** and copy the **Transaction pooler** connection string (port `6543`) into `DATABASE_URL`.
3. Copy the **Session pooler** connection string (port `5432`) into `DIRECT_URL` for Prisma migrations and Studio. You can use the direct database connection instead if your network supports IPv6 or your project has the IPv4 add-on. Do not use the transaction pooler for migrations.
4. Replace the password placeholder with your database password, URL-encoding special characters. Use the exact project reference and pooler host from the dashboard, and retain `?sslmode=require` as shown in `client/.env.example`.
5. Follow the local setup below to apply the tables with `npm run db:deploy`.

The application uses its existing JWT authentication and server-side Prisma queries. Supabase Auth, Storage, and browser API keys are not required. The migration enables row-level security on the four application tables with no public policies, so the Supabase Data API cannot expose users' password hashes or bypass the application's authorization. The server connection uses the dashboard's `postgres` role; a custom Prisma role must have the necessary table privileges and `BYPASSRLS`. You may disable the Supabase Data API if it is unused.

Connection guidance: [Supabase's Prisma guide](https://supabase.com/docs/guides/database/prisma).

## Local development

```powershell
cd client
Copy-Item .env.example .env
# Fill in DATABASE_URL, DIRECT_URL, JWT_SECRET, and Cloudinary values as needed.
npm.cmd install
npm.cmd run db:deploy
npm.cmd run dev
```

`client/.env` is ignored by Git. Shell and deployment environment variables take priority; `client/server/.env` is supported as a legacy fallback. `npm run db:generate` can run without database credentials.

For later schema changes, run `npm run db:migrate -- --name describe_change` against a development database. Prisma's development workflow requires permission to create a shadow database. Use a local PostgreSQL database or a suitable development role when needed. Use `db:deploy` to apply committed migrations to hosted databases; it does not require a shadow database.

## Deploy to Vercel

1. Import the repository and set **Root Directory** to `client`.
2. Add these environment variables:

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Supabase transaction pooler URL, port `6543`. |
| `DIRECT_URL` | Yes | Supabase session pooler or direct URL, port `5432`, used during builds. |
| `JWT_SECRET` | Yes | A long, unique random signing secret. |
| `JWT_EXPIRES_IN` | No | Defaults to `30d`. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | First admin setup | An unused email and random password of at least 12 characters. Never use `NEXT_PUBLIC_` for these values. |
| `ADMIN_NAME` | No | Defaults to `UniShop Admin`. |
| Cloudinary variables | For uploads | Required for listing photos. |

3. Deploy. `vercel.json` runs `npm run vercel-build`, which applies committed PostgreSQL migrations before building Next.js. Configure preview deployments with a separate Supabase development project so previews do not migrate production data.

Database deployment also runs the first-admin setup. It preserves existing admins and credentials changed in **Admin → Settings**, even if the bootstrap email/password still exist in the environment. After initial setup, those environment values may be removed. All credentials used for subsequent logins come from the database.

APIs keep their existing paths, such as `/api/products`, `/api/auth/login`, and `/api/admin/stats`. `/api/health` checks database connectivity. Data persists in Supabase across function restarts and deployments.

## Existing SQLite data

The old SQL migration is archived under `client/server/prisma/sqlite-migrations/` and is excluded from PostgreSQL migration history. Existing `.db` files are untouched. The new migration creates empty PostgreSQL tables; it does not transfer SQLite rows. Export/import any existing data separately, preserving IDs and relationships. If the target Supabase database already contains application tables, reconcile and baseline that schema before applying the initial migration.
