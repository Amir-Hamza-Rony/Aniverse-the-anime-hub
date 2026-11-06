# AniVerse

**Your Universe of Anime** — A premium, full-stack anime streaming, download, and monetization platform.

## Overview

AniVerse is a modern, production-oriented anime streaming and download platform built with Next.js 16, TypeScript, Tailwind CSS, and MongoDB. It supports both authorized anime streaming and downloading, a complete admin dashboard, secure authentication with RBAC, and Adsterra advertising monetization.

## Technology Stack

### Frontend
- Next.js 16 (App Router, React 19)
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui-style components
- Lucide React Icons
- React Hook Form + Zod
- Sonner (toasts)
- Date-fns
- HLS.js + HTML5 video player

### Backend
- Next.js API Routes / Route Handlers
- Node.js
- MongoDB Atlas + Mongoose
- JWT authentication (httpOnly cookies)
- Role-Based Access Control (RBAC)

### Storage
- Cloudflare R2 / S3-compatible (direct presigned uploads)
- Cloudinary (images: posters, banners)

### Monetization
- Adsterra Smartlinks / Direct Links via admin-configurable placements

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Cloudflare R2 or S3 bucket (for videos)
- Cloudinary account (for images)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your actual credentials

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

See `.env.example` for all required variables. Never commit actual credentials.

## Project Structure

```
src/
  app/                # App Router routes
    (public)/         # Public website routes
    admin/            # Admin dashboard
    api/              # API route handlers
  components/
    ui/               # Base UI components
    layout/           # Layout components (navbar, footer, admin layout)
    anime/            # Anime-related components
    player/           # Video player components
    download/         # Download components
    admin/            # Admin-specific components
  lib/                # Utility libraries
    auth/             # Authentication
    database/         # Database connection
    storage/          # R2 / Cloudinary storage
    advertisements/   # Adsterra redirect/click logic
    analytics/        # Analytics
    validation/       # Zod schemas
    api/              # API response helpers
  models/             # Mongoose models
  services/           # Business logic services
  hooks/              # React hooks
  types/              # TypeScript types
  config/             # Configuration constants
public/
docs/                 # Documentation
```

## Key Features

- **Public Website**: Homepage, anime discovery, anime details, watch page, download page
- **User System**: Registration, login, profile, watchlist, favorites, watch history, download history
- **Admin Dashboard**: Overview, anime management, episode management, genres, users, advertisements, analytics, settings
- **Video Player**: HLS.js support, multiple servers, quality selection, subtitles, playback controls
- **Download**: Multiple servers, quality selection (360p-1080p), file size display, download history
- **Monetization**: Adsterra smartlink integration with validated redirect system
- **Analytics**: Click tracking, streaming/download activity, charts, CSV export
- **SEO**: Dynamic metadata, Open Graph, sitemap, robots.txt

## Security

- Secure password hashing (bcrypt, 12 rounds)
- JWT authentication with httpOnly cookies
- Role-based access control (USER, ADMIN, SUPER_ADMIN)
- Protected admin routes
- Open redirect protection
- Rate limiting
- Input validation and sanitization
- File type and size validation
- MongoDB injection protection
- Audit logging

See `docs/security.md` for details.

## License

Private — All rights reserved.
