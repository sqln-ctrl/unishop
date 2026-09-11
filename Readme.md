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
- Prisma ORM 7 and SQLite
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

Use Node.js 20.9+ (Node.js 22 or 24 is recommended). SQLite is created locally at `client/server/prisma/dev.db`.

```powershell
cd client
Copy-Item .env.example .env
# Add a secure JWT_SECRET to .env
npm.cmd install
npm.cmd run db:deploy
npm.cmd run dev
```

Open `http://localhost:3000`. The API is available from the same origin, such as `http://localhost:3000/api/products`.

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
| `DATABASE_URL` | No | Local SQLite URL; defaults to `file:./prisma/dev.db`. |
| `JWT_SECRET` | Yes | Private JWT signing secret. |
| `JWT_EXPIRES_IN` | No | Session duration; defaults to `30d`. |
| Cloudinary variables | For uploads | Listing photo hosting credentials. |
| `CLIENT_URL` | No | A separately hosted frontend origin. |

## Deploying to Vercel

Set the Vercel project's Root Directory to `client`, configure the environment variables, and deploy. Full instructions are in [`DEPLOYMENT.md`](DEPLOYMENT.md).

Vercel runs SQLite only as ephemeral `/tmp` storage, so this deployment is suitable for demos and previews but not durable production marketplace data.
