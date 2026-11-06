# Architecture Document — AniVerse

## High-Level Architecture

AniVerse is a monolithic full-stack Next.js application with a clear separation between the public website, admin dashboard, and API layer.

```
Client (Browser)
    │
    ▼
Next.js App Router
├── (public)/   — Public website (SSR/SSG)
├── admin/      — Admin dashboard (protected)
└── api/        — RESTful API routes
    │
    ▼
MongoDB Atlas (Mongoose ODM)
    │
    ▼
External Services
├── Cloudflare R2 / S3 — Video file storage
├── Cloudinary — Image storage (posters, banners)
└── Adsterra — Advertising monetization
```

## Layer Responsibilities

### Presentation Layer (Frontend)
- Next.js App Router with React Server Components where appropriate
- Client components for interactivity (video player, forms, dashboards)
- Tailwind CSS for styling
- shadcn/ui-style component library

### API Layer (Backend)
- Next.js Route Handlers (`/api/*`)
- Centralized error handling, request validation, auth middleware
- JWT-based stateless authentication
- Role-based access control (USER, ADMIN, SUPER_ADMIN)

### Data Layer
- Mongoose models with schema validation
- MongoDB Atlas with proper indexes
- Connection pooling via cached connection

### Storage Layer
- Direct-to-object-storage presigned URLs for video uploads
- Cloudinary for image uploads

## Authentication Flow

1. User registers/logs in via `/api/auth/*`
2. Server issues JWT access token (7 days) and refresh token (30 days)
3. Tokens stored in httpOnly cookies
4. Middleware validates tokens on protected routes
5. API routes use `withAuth` middleware for role enforcement

## Monetization Flow

1. User clicks WATCH or DOWNLOAD
2. Redirect to `/go/watch/[id]` or `/go/download/[id]`
3. Ad landing page shown with sponsor info + Continue button
4. User clicks Continue → proceeds to authorized player/download
5. Click recorded separately from streaming/download activity

## Security Boundaries

- Admin routes protected by middleware (ADMIN/SUPER_ADMIN only)
- API routes validate user roles via `withAuth`
- Client never trusted for roles or user IDs
- Open redirect protection on `/go/*` routes
- Sensitive config kept in environment variables only
