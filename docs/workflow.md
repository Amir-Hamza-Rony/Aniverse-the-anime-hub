# Development Workflow — AniVerse

## Development Phases

The project was built following these phases:

### Phase 1 — Project Setup & Design System
- Next.js 16 App Router setup
- TypeScript strict configuration
- Tailwind CSS v4 configuration
- shadcn/ui-style component library (Button, Card, Input, Select, Badge, Avatar, Skeleton, Table, Dialog, Toaster)
- AniVerse design system (dark theme, violet accents)
- Shared layouts (navbar, footer, admin layout)
- Initial documentation

### Phase 2 — Public Website UI
- Homepage with all sections (hero, featured, trending, popular, recently updated, latest episodes, latest releases, recommended, genres, recently added)
- Anime discovery with search and filters
- Anime details page
- Watch page with video player
- Download page
- Responsive navigation

### Phase 3 — Backend & Database
- Mongoose models (15 models)
- MongoDB connection with caching
- API routes (auth, anime, episodes, genres, advertisements, analytics, watch-history, favorites, downloads, streaming, storage, settings)
- JWT authentication with httpOnly cookies
- Role-based access control

### Phase 4 — Monetization & Redirect
- Adsterra advertisement model
- Click tracking with deduplication
- `/go/watch/[id]`, `/go/download/[id]`, `/go/server/[id]` redirect pages
- User-initiated Continue button flow (no forced redirects)

### Phase 5 — Admin Dashboard
- Admin layout (sidebar, top nav)
- Overview with statistics
- Anime management
- Episode management
- Genre management
- User management
- Advertisement management
- Analytics
- Settings

### Phase 6 — Security, SEO & Documentation
- Security headers, CSRF considerations, rate limiting
- Input validation with Zod
- Open redirect protection
- Dynamic metadata, Open Graph, sitemap, robots.txt
- Complete documentation

## Daily Development

```bash
# Start dev server
npm run dev

# Lint
npm run lint

# Build
npm run build
```

## Testing Instructions

1. **Public Website**: Navigate to `/`, browse anime, click into details, test watch/download pages
2. **Authentication**: Register, login, verify cookies are set, access `/profile`
3. **Admin**: Login as admin, access `/admin`, manage anime/episodes/ads
4. **Monetization**: Click WATCH or DOWNLOAD, verify ad landing page appears, click Continue
5. **API**: Test endpoints with curl or Postman, verify auth protection

## Code Conventions

- TypeScript strict mode throughout
- Zod schemas for input validation
- Centralized error handling via `handleError`/`successResponse`/`errorResponse`
- `withAuth` middleware for protected API routes
- Mongoose models with schema validation
- Server components for data fetching, client components for interactivity
