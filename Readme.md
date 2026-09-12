# UniShop

UniShop is a university marketplace where students can buy, sell, and discover textbooks, electronics, clothing, hostel items, and services within their campus community.

The project is a single full-stack Next.js application. The UI uses the App Router, and the existing marketplace API is served at `/api/*` from the same deployment. It is designed to deploy as one Vercel project.

## Features

- Student registration, login, JWT sessions, profiles, and seller accounts
- Marketplace listings with search, filters, categories, conditions, and sorting
- Create, edit, delete, and mark listings as sold
- Cloudinary image uploads
- Wishlists, reports, and protected admin moderation tools
- Responsive campus marketplace design

## Stack

- Next.js 16, React, Tailwind CSS
- Next API function with Express route modules
- Prisma ORM 7 and Supabase PostgreSQL
- Cloudinary, Multer, JWT, and bcrypt

## Project structure

```text
client/
├── src/app/                 # Next App Router pages and layout
├── src/pages/api/           # Next API function entry point
├── src/views/               # Existing marketplace UI feature views
├── src/components/          # Shared UI components and route guards
├── src/services/            # Browser API clients
├── server/                  # API routes, controllers, Prisma schema, migrations
├── prisma.config.ts         # Prisma configuration for the unified project
└── vercel.json              # Vercel build configuration
```

## Local development

Use Node.js 20.9+ (Node.js 22 or 24 is recommended). Create a Supabase project and get its PostgreSQL connection strings from **Connect** in the dashboard.

```powershell
cd client
Copy-Item .env.example .env
# Set DATABASE_URL, DIRECT_URL, and a secure JWT_SECRET in .env
npm.cmd install
npm.cmd run db:deploy
npm.cmd run dev
```

Open `http://localhost:3000`. The API is available from the same origin, such as `http://localhost:3000/api/products`.

Use the transaction pooler (port 6543) for `DATABASE_URL` and the session pooler (port 5432) for `DIRECT_URL`. Copy your project's exact host and URL-encode special characters in the database password. Prisma connects directly to PostgreSQL; no Supabase API key is needed. Existing JWT authentication remains in use. See [database setup](DEPLOYMENT.md#supabase-database-setup) for details.

### Admin setup and permissions

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (at least 12 characters), and optionally `ADMIN_NAME` in `client/.env`. Run `npm run db:deploy` to apply migrations and create the first admin, or `npm run admin:setup` after migrations are applied. The setup skips creation when any admin already exists and never promotes an existing regular account by matching its email.

Log in at `/login`; admins are sent to `/admin`. Use **Settings** to change your login email/password or create another admin. Changes are saved in Supabase and survive redeployments; `.env` values are only for initial setup and are not rewritten by the dashboard. Credential changes invalidate other sessions. **Users** provides role controls; you cannot remove your own admin role or delete your own account. Administrative role changes sign the affected user out.

| Role | Access |
| --- | --- |
| Regular | Browse, manage own profile, wishlist, and submit reports. Can opt into a seller account. |
| Seller | Regular access plus uploads and creating/managing their own listings. |
| Admin | Seller access plus user/role management, listing moderation, reports, statistics, and admin settings. |

All restricted API routes check the authenticated user's current database permissions. Public registration and profile/account-type updates cannot grant admin access. Browser sessions are revalidated with the server when the app loads.

Run `npm test` for authorization and bootstrap regression checks.

### Database commands

Run these inside `client/`:

| Command | Purpose |
| --- | --- |
| `npm run db:generate` | Regenerate Prisma Client after schema changes. |
| `npm run db:migrate -- --name describe_change` | Create and apply a development migration. |
| `npm run db:deploy` | Apply committed migrations. |
| `npm run db:studio` | Open Prisma Studio. |

## Environment variables

Use [`client/.env.example`](client/.env.example) as the template.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Supabase PostgreSQL transaction pooler URL for the application. |
| `DIRECT_URL` | For database commands/deploys | Session pooler or direct PostgreSQL URL for Prisma CLI. |
| `JWT_SECRET` | Yes | Private JWT signing secret. |
| `JWT_EXPIRES_IN` | No | Session duration; defaults to `30d`. |
| Cloudinary variables | For uploads | Listing photo hosting credentials. |
| `CLIENT_URL` | No | A separately hosted frontend origin. |

## Deploying to Vercel

Set the Vercel project's Root Directory to `client`, configure the environment variables, and deploy. Full instructions are in [`DEPLOYMENT.md`](DEPLOYMENT.md).

Marketplace data is stored persistently in Supabase across deployments and function restarts.
