# Deployment Guide — AniVerse

## Prerequisites

- Node.js 20+
- MongoDB Atlas cluster
- Cloudflare R2 bucket (for videos) or S3-compatible storage
- Cloudinary account (for images)
- Domain name (for production)

## Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Copy `.env.example` to `.env.local` (development) or set them in your hosting provider (production).

Required variables:
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Signing secret for access tokens
- `JWT_REFRESH_SECRET` — Signing secret for refresh tokens
- `NEXT_PUBLIC_APP_URL` — Public URL of the application
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — Bootstrap super-admin
- `CLOUDINARY_*` — Cloudinary credentials
- `R2_*` — Cloudflare R2 / S3 credentials
- `ADSTERRA_ENABLED` — Enable/disable advertising

## Deployment Options

### Vercel (Recommended for Next.js)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel project settings
3. Deploy on push to main

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_ENV=production
CMD ["npm", "start"]
```

```bash
docker build -t aniverse .
docker run -p 3000:3000 --env-file .env.local aniverse
```

### Self-Hosted (PM2)

```bash
npm run build
npm install -g pm2
pm2 start npm -- start --name aniverse
pm2 save
pm2 startup
```

## Database Setup

1. Create a MongoDB Atlas cluster
2. Add your IP to the access list
3. Get the connection string
4. Set `MONGODB_URI` in environment variables
5. The first admin user is bootstrapped from `ADMIN_EMAIL`/`ADMIN_PASSWORD`

## Storage Setup

### Cloudflare R2
1. Create an R2 bucket
2. Create an API token with read/write access
3. Set `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`
4. Optionally set `R2_PUBLIC_URL` for a custom domain

### Cloudinary
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## Adsterra Setup

1. Sign up as an Adsterra publisher
2. Create Smartlinks/Direct Links for your placements
3. Add them via the Admin Dashboard → Advertisements
4. Configure placement types: WATCH, DOWNLOAD, SERVER_SELECTION

## Security Checklist

- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` are strong and unique
- [ ] Admin password changed from default
- [ ] `NODE_ENV=production` in production
- [ ] Cookies use `secure` flag in production (automatic via NODE_ENV)
- [ ] No credentials committed to version control
- [ ] MongoDB Atlas access list restricted
- [ ] Rate limiting considered for API routes

## Monitoring

- Check `/api/analytics` for platform metrics
- Monitor MongoDB Atlas performance
- Watch R2/S3 storage costs
- Review Adsterra publisher dashboard for ad revenue
