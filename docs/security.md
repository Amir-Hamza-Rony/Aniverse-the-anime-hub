# Security Document — AniVerse

## Authentication

- Passwords hashed with bcrypt (12 salt rounds)
- JWT access tokens (7-day expiry) and refresh tokens (30-day expiry)
- Tokens stored in httpOnly, secure (in production), sameSite=lax cookies
- Server-side session validation; client never trusted for roles or user IDs
- Last active super-admin protected from deletion/demotion

## Authorization

- Role-Based Access Control (RBAC): USER, ADMIN, SUPER_ADMIN
- Admin routes protected by Next.js middleware
- API routes use `withAuth` middleware for role enforcement
- `requireRole` helper for fine-grained checks

## Input Validation & Sanitization

- Zod schemas for all request bodies
- Input sanitization to prevent injection
- MongoDB injection protection via Mongoose schema casting
- File type validation (images only: jpeg, png, webp)
- File size validation (10MB max for images)

## Redirect Safety

- Open redirect protection on `/go/*` routes
- Only relative paths or trusted external hosts allowed
- No forced or hidden redirects
- No automatic downloads
- User-initiated Continue button for Adsterra flow
- Chained redirects avoided; landing page used instead

## Rate Limiting & Abuse Prevention

- Click deduplication window (1 minute) to prevent click inflation
- Authentication rate limiting recommended at infrastructure level
- Password reset tokens expire after 10 minutes

## Audit Logging

- ActivityLog model records user actions (register, login, password reset, admin actions)
- Each log includes userId, action, entity, entityId, metadata, ipAddress, timestamp

## Error Handling

- Centralized error handler in API routes
- Errors logged server-side, not exposed to client
- No stack traces or database details in client responses

## Environment Security

- All secrets in environment variables (`.env.local`, never committed)
- `JWT_SECRET`, `JWT_REFRESH_SECRET`, `MONGODB_URI`, storage credentials kept server-side
- `NEXT_PUBLIC_*` variables are the only ones exposed to the browser
- `.env.example` provided without actual values

## Secure Headers

Recommended production headers (configure at edge/proxy):
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` (restrictive)
- `Strict-Transport-Security` (HTTPS)

## Storage Security

- Video files never stored in MongoDB
- Direct-to-object-storage presigned URLs (short-lived)
- Image uploads via Cloudinary with validated file types
- Public URLs only for authorized content

## Copyright Compliance

- Platform only hosts/distributes anime the owner has created, licensed, or has explicit permission to distribute
- No DRM bypass, unauthorized video extraction, or copyright infringement
- All streaming/download URLs must be authorized
