# API Documentation — AniVerse

Base URL: `http://localhost:3000` (or `NEXT_PUBLIC_APP_URL`)

All API responses follow this structure:

```json
{
  "success": true,
  "message": "optional message",
  "data": { ... },
  "error": null
}
```

Errors:

```json
{
  "success": false,
  "error": "Error message",
  "data": null
}
```

## Authentication

### POST `/api/auth/register`
Register a new user.
Body: `{ name, email, password }`

### POST `/api/auth/login`
Log in and set auth cookies.
Body: `{ email, password }`

### DELETE `/api/auth/login`
Logout (clear cookies).

### GET `/api/auth/me`
Get current authenticated user.
Requires auth cookie.

### POST `/api/auth/forgot-password`
Request password reset.
Body: `{ email }`

### POST `/api/auth/reset-password`
Reset password with token.
Body: `{ token, password }`

## Anime

### GET `/api/anime`
List anime with filters.
Query: `page, limit, q, genre, year, status, type, sort`

### POST `/api/anime`
Create anime (ADMIN only).
Body: anime fields

### GET `/api/anime/home`
Get homepage section data.

### GET `/api/anime/[slug]`
Get anime details by slug.

### PUT `/api/anime/[slug]`
Update anime (ADMIN only).

### DELETE `/api/anime/[slug]`
Delete anime (ADMIN only).

## Episodes

### GET `/api/episodes`
List episodes.
Query: `animeId, page, limit`

### POST `/api/episodes`
Create episode (ADMIN only).

### GET `/api/episodes/[id]`
Get episode by ID.

### PUT `/api/episodes/[id]`
Update episode (ADMIN only).

### DELETE `/api/episodes/[id]`
Delete episode (ADMIN only).

## Genres

### GET `/api/genres`
List all genres.

### POST `/api/genres`
Create genre (ADMIN only).

### PUT `/api/genres/[id]`
Update genre (ADMIN only).

### DELETE `/api/genres/[id]`
Delete genre (ADMIN only).

## Advertisements

### GET `/api/advertisements`
List ads, or get ad by placement.
Query: `placementType, animeId, episodeId`

### POST `/api/advertisements`
Create ad (ADMIN only).

### PUT `/api/advertisements/[id]`
Update ad (ADMIN only).

### DELETE `/api/advertisements/[id]`
Delete ad (ADMIN only).

### POST `/api/advertisements/click`
Record an ad click.
Body: `{ advertisementId, placementType, animeId, episodeId }`

## Streaming

### GET `/api/streaming`
Get streaming sources for an episode.
Query: `episodeId`

### POST `/api/streaming`
Record streaming activity.

## Downloads

### GET `/api/downloads`
List download activity.

### POST `/api/downloads`
Record download activity.

## Watch History

### GET `/api/watch-history`
List user watch history.

### POST `/api/watch-history`
Record watch history.

## Favorites

### GET `/api/favorites`
List user favorites.

### POST `/api/favorites`
Add/remove favorite.

## Storage

### GET `/api/storage`
List video/download sources.

### POST `/api/storage`
Create source (ADMIN only).

## Settings

### GET `/api/settings`
Get site settings.

### PUT `/api/settings`
Update settings (ADMIN only).

## Analytics

### GET `/api/analytics`
Get analytics data.
Query: `range` (7d, 30d, 90d)

## Redirect (Monetization)

### GET `/go/watch/[id]`
Watch advertisement flow.

### GET `/go/download/[id]`
Download advertisement flow.

### GET `/go/server/[id]`
Server selection advertisement flow.

## Authentication Middleware

Protected routes use `withAuth` which:
1. Reads the `aniverse_token` httpOnly cookie
2. Verifies the JWT signature
3. Enforces role-based access control
4. Returns 401 if unauthenticated, 403 if unauthorized

Roles: `USER`, `ADMIN`, `SUPER_ADMIN`
