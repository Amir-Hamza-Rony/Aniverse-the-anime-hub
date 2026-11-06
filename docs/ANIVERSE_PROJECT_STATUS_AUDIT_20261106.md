# AniVerse — Project Status Audit

**Audit type:** Read-only project status audit (no code changes, no installs, no builds run)
**Project:** AniVerse — Full-Stack Anime Streaming and Download Platform
**Working directory:** `D:\Anime Upload site`
**Audit date:** 2026-11-06
**Auditor:** Kilo (Senior Software Architect / Full-Stack Project Auditor)

---

## 1. Project Overview

AniVerse is a full-stack anime streaming and download platform built with Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui-style components, MongoDB + Mongoose, JWT (httpOnly cookie) authentication with RBAC, Cloudflare R2 / S3-compatible video storage, Cloudinary image storage, and Adsterra smartlink monetization. It includes a public website, an admin dashboard, video streaming (HLS.js + MP4), download functionality, watch/download history, favorites, analytics, and advertising.

---

## 2. Current Git Branch and Status

**Git is NOT initialized in this project.** There is no `.git` directory.

- Current branch: N/A (no git repo)
- Working tree status: N/A
- Latest commits: N/A (no commit history)
- Recent commit history: N/A
- Uncommitted changes: N/A
- Untracked files: N/A

> The previous development report references a "recovery session" with "no git history," which is consistent with the current state. No version control is present, so no commit/branch/status information can be reported.

---

## 3. Technology Stack

| Layer | Technology | Version (from package.json) |
|---|---|---|
| Framework | Next.js (App Router) | 16.4.3 |
| UI Library | React | 19.3.0 |
| React DOM | react-dom | 19.3.0 |
| Language | TypeScript (strict) | ^5 |
| Styling | Tailwind CSS | ^4 |
| Turbopack CSS | @tailwindcss/turbopack | ^4 |
| UI components | shadcn/ui-style (custom `src/components/ui/*`) | local |
| Icons | lucide-react | ^1.66.0 |
| Forms | react-hook-form | ^7.91.0 |
| Validation | zod | ^4.6.7 |
| Toasts | sonner | ^2.0.8 |
| Database | MongoDB + Mongoose | ^9.11.4 |
| Auth | JWT (jsonwebtoken) + bcryptjs | ^9.0.3, ^3.0.3 |
| Storage (video) | Cloudflare R2 / S3 via @aws-sdk | ^3.1161.0 |
| Storage (images) | Cloudinary | ^2.11.0 |
| Video playback | hls.js | ^1.7.4 |
| Charts | recharts | ^3.0.0 |
| Lint | eslint | ^9 |
| ESLint config | eslint-config-next | 16.4.3 |

**package-lock.json:** NOT present (absent from working tree).
**node_modules:** NOT installed (confirmed absent).

---

## 4. Current Project Structure

```
D:\Anime Upload site\
  .env.example
  .gitignore
  AGENTS.md
  docs/                        (8 doc files)
  eslint.config.mjs
  next.config.ts
  package.json
  public/                      (robots.txt + svg assets)
  src/
    app/
      layout.tsx               (root layout, Navbar, Toaster, metadata)
      page.tsx                 (default Next.js starter page — NOT the anime homepage)
      sitemap.ts               (returns null; not implemented)
      globals.css              (Tailwind v4 import + theme vars)
      (public)/                Public website route group
        layout.tsx             (Footer)
        page.tsx               (HOMEPAGE — anime discovery sections, client fetch /api/anime/home)
        anime/[slug]/page.tsx  (Anime details)
        discovery/page.tsx     (Browse with search/filters/pagination)
        watch/[id]/page.tsx    (Watch page, HLS.js player, server selection, episode list)
        download/[id]/page.tsx (Download page, server/quality selection, direct download)
        go/[type]/[id]/page.tsx(Adsterra redirect flow — watch/download/server)
        login/page.tsx         (Login form -> POST /api/auth/login)
        register/page.tsx      (Register form -> POST /api/auth/register)
        forgot-password/       (page only; see API below)
        reset-password/        (page only; see API below)
        error.tsx
        not-found.tsx
      admin/                   Admin dashboard (protected by middleware role check)
        layout.tsx             (wraps AdminLayout client component)
        page.tsx               (Overview — stats cards, placeholder charts)
        anime/page.tsx         (Anime CRUD — list/create/edit/delete)
        episodes/page.tsx      (Episode CRUD)
        genres/page.tsx        (Genre CRUD)
        users/page.tsx         (User management — role/isActive toggle)
        advertisements/page.tsx(Ad CRUD)
        video-sources/page.tsx (Video source CRUD)
        download-sources/page.tsx(Download source CRUD)
        settings/page.tsx      (Settings — wired to /api/settings)
        analytics/page.tsx     (Analytics — placeholder cards, no charts yet)
      api/                     Route handlers
        anime/                 route.ts (GET list, POST create w/ withAuth); [slug]/ (GET/PUT/DELETE); home/ (GET)
        auth/                  login/ (POST, DELETE logout); register/ (POST); me/ (GET w/ withAuth); forgot-password/ (route.ts); reset-password/ (route.ts)
        streaming/             episode/[id]/route.ts (GET — anime+episode+sources)
        downloads/             route.ts (GET history w/ withAuth; POST record w/ withAuth); episode/[id]/route.ts (GET)
        advertisements/        route.ts (GET/POST/PUT/DELETE w/ withAuth); click/route.ts (POST click record)
        analytics/             route.ts (GET — click/stream/download stats)
        users/                 route.ts (GET list w/ withAuth ADMIN; PATCH update w/ withAuth ADMIN)
        watch-history/         route.ts (GET w/ withAuth; POST upsert w/ withAuth)
        favorites/             route.ts (GET w/ withAuth; POST toggle w/ withAuth)
        genres/                route.ts; [id]/route.ts
        episodes/              route.ts; [id]/route.ts
        settings/              route.ts
        storage/               route.ts
    components/
      layout/                  navbar.tsx (cookie-based auth), footer.tsx, admin-layout.tsx
      anime/                   anime-card.tsx (+ AnimeSkeleton)
      player/                  video-player.tsx (HLS.js + MP4, quality, subtitles, fullscreen)
      ui/                      avatar, badge, button, card, dialog, input, label, select, skeleton, table, toaster
    lib/
      auth/                    index.ts (sign/verify JWT, cookies, getServerUser, requireRole); middleware.ts (withAuth, optionalAuth)
      database/                connect.ts (cached mongoose connection)
      storage/                 r2.ts (presigned PUT upload, delete, object URL); cloudinary.ts (upload/delete image)
      advertisements/          redirect.ts (getAdvertisementForPlacement, recordAdvertisementClick, isSafeDestination)
      analytics/               index.ts (recordClickIfUnique, getClickStats, getTopClickedAnime)
      api/                     client.ts (apiFetch/apiJson with credentials: include); handler.ts (success/error/validateBody)
      validation/              schemas.ts (register, login, anime, episode, genre, advertisement, site settings)
      utils.ts                 (cn helper)
    models/                    index.ts + User, Anime, Episode, Season, Genre, WatchHistory, Favorite, Advertisement, AdvertisementClick, StreamingActivity, DownloadActivity, SiteSettings, ActivityLog, VideoSource
    config/                    index.ts (env vars, cookie names, qualities, placement types)
    types/                     index.ts (Role, UserDocument, AnimeDocument, EpisodeDocument, VideoQuality, PlacementType, etc.)
    middleware.ts              (Next middleware: admin + protected user paths, cookie auth)
```

Note: The README references `src/hooks/`, `src/services/`, and `src/lib/api/` subdirectories that do NOT exist in the actual tree. `src/lib/api/` exists (client.ts, handler.ts) but `hooks/` and `services/` are absent.

---

## 5. Phase-by-Phase Completion Status

| Phase | Status | Summary |
|---|---|---|
| Phase 1 — Project Setup & Design System | COMPLETE | Next.js 16 App Router, TS strict, Tailwind v4, shadcn/ui components, layouts, design tokens, docs present. Root `page.tsx` is still the Next.js starter page (not replaced with anime homepage). |
| Phase 2 — Public Website UI | COMPLETE | Homepage, discovery (search/filters/pagination), anime details, watch page, download page, login/register, responsive navbar, `/go/[type]/[id]` ad redirect. |
| Phase 3 — Database & Authentication | COMPLETE | 15 Mongoose models, cached dbConnect, JWT access+refresh httpOnly cookies, register/login/me, bcrypt (12 rounds), RBAC (USER/ADMIN/SUPER_ADMIN), middleware role guards. |
| Phase 4 — Admin Dashboard | COMPLETE | Overview, anime, episodes, genres, users, advertisements, video-sources, download-sources, settings, analytics pages all present with CRUD UI. |
| Phase 5 — Video Streaming & Download | COMPLETE (UI/API) / UNVERIFIED (runtime) | Streaming & download APIs exist, video-player with HLS.js/MP4/quality/subtitles, download page with server/quality selection. Storage presigned upload implemented. Watch/download history APIs exist. Runtime not testable without MongoDB. |
| Phase 6 — Adsterra Integration | PARTIAL | Advertisement model + API CRUD, smartlink placement logic, click recording API, `/go/[type]/[id]` redirect flow, `isSafeDestination` open-redirect guard. CSV export not seen. Campaign management limited to admin CRUD. No click deduplication in the click API route (dedup exists in analytics lib but not wired to the click route). |
| Phase 7 — Analytics | PARTIAL | Analytics API route (clicks by day/placement, stream/download counts, top anime), Recharts installed, models (StreamingActivity, DownloadActivity, AdvertisementClick). Analytics admin page is placeholder only (no charts rendered, no CSV export). |
| Phase 8 — Security & Optimization | PARTIAL | JWT httpOnly cookies, bcrypt, RBAC, open-redirect protection (`isSafeDestination`), Zod input validation, file type/size constants, ActivityLog audit logging. No rate limiting implementation found. No CSRF beyond SameSite=lax. SEO partial (metadata on root, sitemap returns null). |
| Phase 9 — Production Deployment | NOT STARTED | deployment.md doc exists, but no hosting config (vercel.json, Dockerfile, etc.), no build output verification (node_modules absent), no env validation at build time. |

---

## 6. Completed Features (verified in source)

- Next.js 16 App Router project structure
- TypeScript strict mode, `tsconfig.json` with path alias `@/*`
- Tailwind CSS v4 (`globals.css` `@import "tailwindcss"`)
- shadcn/ui component set (`src/components/ui/*`)
- Public homepage with featured/trending/popular sections (`src/app/(public)/page.tsx`)
- Discovery page with search, genre/year/status/type/sort filters, pagination (`src/app/(public)/discovery/page.tsx`)
- Anime details page (`src/app/(public)/anime/[slug]/page.tsx`)
- Watch page with HLS.js + MP4 player, multiple servers, quality selection, subtitles, episode list (`src/app/(public)/watch/[id]/page.tsx`, `video-player.tsx`)
- Download page with server/quality selection and direct file download (`src/app/(public)/download/[id]/page.tsx`)
- Login/Register pages + API routes (`/api/auth/login`, `/api/auth/register`, `/api/auth/me`, logout DELETE)
- JWT access + refresh tokens in httpOnly cookies (`src/lib/auth/index.ts`)
- `withAuth` / `optionalAuth` API middleware with RBAC (`src/lib/auth/middleware.ts`)
- Next.js middleware for admin + protected user route guards (`src/middleware.ts`)
- 15 Mongoose models (`src/models/`)
- Cached MongoDB connection (`src/lib/database/connect.ts`)
- Anime API: list (with filters/pagination), home aggregator, detail, CRUD
- Streaming API: `/api/streaming/episode/[id]`
- Download API: `/api/downloads/episode/[id]`, `/api/downloads` (history + record)
- Favorites API (toggle), Watch-history API (upsert)
- Users API (list ADMIN, PATCH role/isActive ADMIN)
- Advertisement API CRUD + click recording API
- Analytics API (click stats, stream/download counts, top clicked anime)
- Settings API
- Storage API + R2 presigned upload + Cloudinary image upload
- Adsterra smartlink placement logic + `/go/[type]/[id]` redirect page + click recording
- `src/lib/api/client.ts` shared API client (credentials: include)
- All 9 admin pages rewritten with CRUD UI (anime, episodes, genres, users, advertisements, video-sources, download-sources, settings, overview)
- `src/models/index.ts` exports `DownloadSource` from `VideoSource.ts` (bug fix verified)
- `package.json` includes all runtime deps including recharts
- `robots.txt` present in public/

---

## 7. Partially Completed Features

| Feature | Status | Detail |
|---|---|---|
| Root homepage | PARTIAL | `src/app/page.tsx` is still the default Next.js starter page; the real homepage lives at `src/app/(public)/page.tsx`. It's unclear which is served (both exist; `(public)/page.tsx` is behind the route group). |
| Sitemap | PARTIAL | `src/app/sitemap.ts` exists but returns `null` — not generating routes. |
| robots.txt | COMPLETE | Present in `public/`. |
| Analytics charts | PARTIAL | Recharts installed; analytics API exists; admin analytics page has only placeholder text ("Chart: ..."). No Recharts components rendered. |
| CSV export | PARTIAL / NOT STARTED | Not found in source. Mentioned in README but no implementation located. |
| Click deduplication | PARTIAL | Dedup logic exists in `src/lib/analytics/index.ts` (`recordClickIfUnique`) but the `/api/advertisements/click` route uses `recordAdvertisementClick` (no dedup window). |
| Forgot/Reset password | PARTIAL | Pages exist (`/forgot-password`, `/reset-password`) and API route files exist, but were not read in full; email service env vars are optional/empty. |
| Watchlist | PARTIAL | `User` model has `watchlist` field, but no watchlist API route or UI found. |
| Rate limiting | NOT STARTED | No rate-limiting middleware or library found. |
| Open redirect protection | COMPLETE (partial) | `isSafeDestination` exists in `src/lib/advertisements/redirect.ts` but does not appear to be wired into the `/go/[type]/[id]` page (which directly calls `window.open(ad.smartlinkUrl)`). |

---

## 8. Missing Features

- No `package-lock.json`; `node_modules` not installed (cannot verify install/build without `npm install`, which is out of scope for this audit).
- No git repository (no version control).
- No watchlist API or UI (model field exists only).
- No email/password-reset implementation (SMTP env vars empty; routes exist but unverified).
- No rate limiting.
- No CSRF protection beyond cookie SameSite.
- No CSV export for analytics.
- No Recharts charts rendered in admin analytics page.
- `sitemap.ts` returns null (no dynamic sitemap generation).
- Root `page.tsx` is the Next.js starter, not the anime homepage.
- No `src/hooks/` or `src/services/` directories (referenced in README but absent).
- No deployment config files (vercel.json, Dockerfile, etc.).
- No admin "campaign management" beyond advertisement CRUD.
- No download authorization middleware (download sources are public via API).

---

## 9. Broken Features

None definitively broken based on source inspection. However, the following are UNVERIFIED and likely broken at runtime until dependencies are installed and a database is connected:

- All API routes require MongoDB (`MONGODB_URI`) — cannot be tested without a live database and `npm install`.
- The build cannot be verified because `node_modules` is absent.
- `window.open(ad.smartlinkUrl, "_blank")` in `/go/[type]/[id]/page.tsx` may be blocked by popup blockers; not a code break but a UX concern.
- `video-player.tsx` calls `video.play()` without user gesture handling in some paths — may fail under browser autoplay policies (runtime behavior, not verified).

---

## 10. Previous Development Report Verification

The previous OpenCode session reported these completed changes. Each verified against current source:

| # | Reported change | Verified? | Evidence |
|---|---|---|---|
| 1 | `src/models/index.ts` — DownloadSource export fixed | YES | `src/models/index.ts:14`: `export { VideoSource, DownloadSource } from "./VideoSource";` and `VideoSource.ts` defines both `VideoSource` and `DownloadSource`. |
| 2 | `src/app/api/anime/route.ts` — POST protected with withAuth | YES | `src/app/api/anime/route.ts:55`: `export const POST = withAuth(..., ["ADMIN", "SUPER_ADMIN"]);`. |
| 3 | `src/app/api/favorites/route.ts` — authenticated user.id used | YES | `src/app/api/favorites/route.ts:34`: `Favorite.findOne({ user: user.id, anime: animeId })` and `Favorite.create({ user: user.id, ... })`. |
| 4 | `src/app/api/watch-history/route.ts` — authenticated user.id used | YES | `src/app/api/watch-history/route.ts:36`: `{ user: user.id, anime: animeId, episode: episodeId }`. |
| 5 | `src/app/api/advertisements/route.ts` — dead POST_LOG export removed | YES | No `POST_LOG` export exists in the file; only GET/POST/PUT/DELETE. |
| 6 | `src/app/(public)/go/[type]/[id]/page.tsx` — click records ad._id | YES | `src/app/(public)/go/[type]/[id]/page.tsx:63`: `advertisementId: ad._id`. |
| 7 | `src/components/layout/navbar.tsx` — cookie-based authentication | YES | Navbar fetches `/api/auth/me` with `credentials: "include"` and calls DELETE `/api/auth/login` with credentials. No localStorage usage. |
| 8 | New API: `src/app/api/streaming/episode/[id]/route.ts` | YES | File exists, GET returns `{ anime, episode, sources }`. |
| 9 | New API: `src/app/api/downloads/episode/[id]/route.ts` | YES | File exists, GET returns `{ episode, anime }`. |
| 10 | New API: `src/app/api/advertisements/click/route.ts` | YES | File exists, POST records click with Zod validation. |
| 11 | New API: `src/app/api/users/route.ts` | YES | File exists, GET list (ADMIN) + PATCH update (ADMIN/SUPER_ADMIN). |
| 12 | Shared API client `src/lib/api/client.ts` | YES | File exists with `apiFetch`/`apiJson` (`credentials: "include"`). |
| 13 | Admin pages rewritten: genres, users, anime, episodes, advertisements, video-sources, download-sources, settings, overview | YES | All 9 page.tsx files exist under `src/app/admin/*/` with CRUD UI. `admin-layout.tsx` includes Video Sources & Download Sources nav items. |
| 14 | package.json updated with missing deps incl. Recharts | YES | `package.json` includes mongoose, zod, jsonwebtoken, bcryptjs, cloudinary, @aws-sdk/*, lucide-react, hls.js, react-hook-form, sonner, recharts ^3.0.0. |

**Conclusion:** Every item in the previous development report is verified as present in the current source code. The development-progress.md "remaining work" items (npm install, build/tsc/eslint, Recharts charts, watch/download verification, final report) remain outstanding.

---

## 11. API Implementation Status

| Route | Method | Auth | Status |
|---|---|---|---|
| `/api/anime` | GET | Public | Implemented |
| `/api/anime` | POST | withAuth ADMIN/SUPER_ADMIN | Implemented |
| `/api/anime/home` | GET | Public | Implemented |
| `/api/anime/[slug]` | GET/PUT/DELETE | GET public; PUT/DELETE not protected (missing withAuth) | PARTIAL (PUT/DELETE unprotected) |
| `/api/auth/login` | POST/DELETE | Public | Implemented |
| `/api/auth/register` | POST | Public | Implemented |
| `/api/auth/me` | GET | withAuth | Implemented |
| `/api/auth/forgot-password` | — | route.ts exists (not read) | UNVERIFIED |
| `/api/auth/reset-password` | — | route.ts exists (not read) | UNVERIFIED |
| `/api/streaming/episode/[id]` | GET | Public | Implemented |
| `/api/downloads` | GET/POST | GET public; POST withAuth | Implemented |
| `/api/downloads/episode/[id]` | GET | Public | Implemented |
| `/api/advertisements` | GET/POST/PUT/DELETE | GET public; mutations withAuth | Implemented |
| `/api/advertisements/click` | POST | Public | Implemented |
| `/api/analytics` | GET | withAuth | Implemented |
| `/api/users` | GET/PATCH | withAuth ADMIN | Implemented |
| `/api/watch-history` | GET/POST | withAuth | Implemented |
| `/api/favorites` | GET/POST | withAuth | Implemented |
| `/api/genres` | GET | route.ts + [id]/route.ts | Implemented |
| `/api/episodes` | GET | route.ts + [id]/route.ts | Implemented |
| `/api/settings` | GET/PUT | route.ts | Implemented |
| `/api/storage` | — | route.ts | Implemented |

**Notable gap:** `PUT`/`DELETE` on `/api/anime/[slug]` are not wrapped in `withAuth`, unlike `POST`. This is an authorization gap (anyone could theoretically update/delete anime via the API if they know the slug).

---

## 12. Database Model Status

| Model | File | Status |
|---|---|---|
| User | User.ts | Complete (bcrypt, RBAC, indexes, comparePassword) |
| Anime | Anime.ts | Complete (text index on title, slug unique, featured index) |
| Episode | Episode.ts | Complete (videoSources/downloadSources embedded, indexes) |
| Season | Season.ts | Complete |
| Genre | Genre.ts | Complete |
| WatchHistory | WatchHistory.ts | Complete |
| Favorite | Favorite.ts | Complete |
| Advertisement | Advertisement.ts | Complete (totalClicks, placement indexes) |
| AdvertisementClick | AdvertisementClick.ts | Complete |
| StreamingActivity | StreamingActivity.ts | Complete |
| DownloadActivity | DownloadActivity.ts | Complete |
| SiteSettings | SiteSettings.ts | Complete |
| ActivityLog | ActivityLog.ts | Complete |
| VideoSource / DownloadSource | VideoSource.ts | Complete (both in one file) |

Total: 15 models. `src/models/index.ts` re-exports all. All verified present.

---

## 13. Authentication and Authorization Status

- **Auth mechanism:** JWT access + refresh tokens, httpOnly cookies (`aniverse_token`, `aniverse_refresh_token`), `SameSite=lax`, `secure` in production.
- **Password hashing:** bcryptjs, 12 rounds (pre-save hook).
- **Token verification:** `verifyAccessToken` in `src/lib/auth/index.ts`.
- **Session retrieval:** `getServerUser()`, `getAccessToken()`.
- **API middleware:** `withAuth` (extracts cookie, verifies, attaches `request.user`, enforces allowedRoles), `optionalAuth`.
- **RBAC:** Roles USER / ADMIN / SUPER_ADMIN enforced in `withAuth` and middleware.
- **Next.js middleware:** Guards `/admin` (ADMIN/SUPER_ADMIN only) and protected user paths (`/profile`, `/watch-history`, `/downloads`, `/favorites`). Public paths allowed.
- **Registration:** defaults role to `USER`, validates unique email.
- **Login:** validates `isActive`, updates `lastLoginAt`, creates ActivityLog.
- **Gaps:** `PUT`/`DELETE` on `/api/anime/[slug]` lack `withAuth`. No email verification flow (token fields exist in model but unused). No password-reset implementation visible. No rate limiting on auth endpoints (brute-force exposure).

---

## 14. Streaming and Download Status

**Streaming:**
- `/api/streaming/episode/[id]` returns anime, episode, and enabled video sources (qualities, URL, isHls, fileSize).
- `video-player.tsx` supports HLS.js (hls.js) and MP4, quality switching, subtitles (text tracks), fullscreen, seek, volume.
- Watch page (`watch/[id]/page.tsx`) fetches streaming data, renders server selection buttons and quality select.
- Multiple servers supported via `videoSources` array with `serverPriority`.

**Download:**
- `/api/downloads/episode/[id]` returns episode + anime metadata.
- `/api/downloads` GET history (withAuth optional userId filter), POST record download (withAuth).
- Download page (`download/[id]/page.tsx`) renders server/quality selection and triggers direct browser download via `<a>` tag.
- Download sources embedded in Episode model (parallel to videoSources).

**Storage:**
- R2 presigned PUT upload (`createPresignedUpload`), `deleteObject`, `getObjectUrl` (`src/lib/storage/r2.ts`).
- Cloudinary image upload/delete (`src/lib/storage/cloudinary.ts`).
- `/api/storage` route exists (not read in full).
- Watch history / download history models exist; history APIs implemented.

**UNVERIFIED:** Actual streaming/download URLs require R2/Cloudinary credentials and a populated database; cannot be tested without runtime.

---

## 15. Adsterra Integration Status

- **Model:** `Advertisement` (name, smartlinkUrl, placementType, campaignName, priority, isEnabled, animeId, episodeId, totalClicks).
- **Placement types:** WATCH, DOWNLOAD, SERVER_SELECTION, HOMEPAGE, DETAILS.
- **API:** CRUD via `/api/advertisements` (mutations admin-protected), click recording via `/api/advertisements/click`.
- **Placement logic:** `getAdvertisementForPlacement` in `src/lib/advertisements/redirect.ts` (scoped by anime/episode, priority-ordered).
- **Click recording:** `recordAdvertisementClick` creates `AdvertisementClick` and increments `totalClicks`.
- **Redirect flow:** `/go/[type]/[id]/page.tsx` fetches ad by placement, opens smartlink in new tab, records click (`ad._id`), proceeds to `/watch` or `/download`.
- **Open redirect guard:** `isSafeDestination` exists but is not visibly wired into the `/go` page (page directly calls `window.open(ad.smartlinkUrl)`).
- **Env:** `ADSTERRA_ENABLED` flag in config; smartlinks configured via admin dashboard (not env vars).
- **Gaps:** Click API route does not apply the deduplication window that exists in `src/lib/analytics`. No campaign management beyond CRUD. No CSV export of clicks. No impression tracking.

---

## 16. Analytics Status

- **Models:** `AdvertisementClick`, `StreamingActivity`, `DownloadActivity`.
- **API:** `/api/analytics` GET — returns click stats (total, byDay, byPlacement), stream count, download count, total anime, total users, top clicked anime. Supports `range` query (7d/30d/90d). Requires auth (withAuth).
- **Lib:** `getClickStats`, `getTopClickedAnime`, `recordClickIfUnique` in `src/lib/analytics/index.ts`.
- **Charts:** Recharts installed (`^3.0.0`) but **no Recharts components rendered anywhere**. Admin analytics page (`src/app/admin/analytics/page.tsx`) has placeholder text only.
- **CSV export:** Not found in source (README mentions it).
- **Dashboard overview:** `/admin` page calls `/api/analytics` and renders stat cards (Total Anime, Users, Streams, Downloads, Ad Clicks) but charts are placeholder.

---

## 17. Security Findings

| Area | Finding | Severity |
|---|---|---|
| Auth cookies | httpOnly, SameSite=lax, secure in production | Good |
| Password hashing | bcrypt 12 rounds | Good |
| RBAC | withAuth + middleware role guards | Good |
| Open redirect | `isSafeDestination` exists but not wired into `/go` page | Medium |
| API authorization | `PUT`/`DELETE /api/anime/[slug]` not protected by withAuth | Medium |
| Rate limiting | None found | Medium |
| Brute force | No login attempt throttling | Medium |
| Email verification | Token fields in model, no flow implemented | Low |
| Password reset | Routes exist, SMTP env empty | Low |
| File upload | R2 presigned PUT (content-type validated), Cloudinary image only; MAX_FILE_SIZE/ALLOWED_IMAGE_TYPES defined | Good |
| MongoDB injection | Mongoose casts prevent classic injection; `$text` search used | Good |
| Audit logging | ActivityLog model + login/register/logout activity | Good |
| SEO | Metadata on root layout; sitemap.ts returns null (no dynamic routes) | Low |
| CSP / headers | No security headers config found | Low |

---

## 18. TypeScript Result

**NOT RUN.** `node_modules` is not installed and `package-lock.json` is absent, so `npx tsc --noEmit` cannot execute. Per audit constraints, `npm install` was not performed.

Notable TS observations from source review:
- `src/lib/auth/index.ts:8`: `const jwts = jwt as any;` — bypasses type safety on jsonwebtoken.
- `src/lib/auth/middleware.ts:30`: `(request as any).user = user;` — `any` cast.
- `src/config/index.ts:6,8`: `JWT_SECRET = process.env.JWT_SECRET || ""` — defaults to empty string; `index.ts:6` throws if `JWT_SECRET` undefined (contradiction: config returns `""`, auth throws only if falsy — `""` is falsy so it throws).
- Some admin pages use `any` for form bodies (`body: any`).
- `tsconfig.json` has `strict: true`, `noEmit: true`, `skipLibCheck: true`.

TypeScript cannot be verified as clean without installing dependencies and running `tsc --noEmit`. Status: **UNVERIFIED**.

---

## 19. Build Result

**NOT RUN.** `node_modules` is absent; `npm run build` (Next.js 16 with Turbopack) cannot execute. Per audit constraints, `npm install` was not performed.

`next.config.ts` is minimal (cacheComponents, partialPrefetching, turbopack CSS rule). No custom webpack, no output config, no image domains configured (images use external URLs directly). `tsconfig.tsbuildinfo` exists (stale build info from a prior build attempt).

Build cannot be verified. Status: **UNVERIFIED** (blocked on `npm install`).

---

## 20. ESLint Result

**NOT RUN.** `node_modules` is absent; `npm run lint` (eslint) cannot execute. ESLint config (`eslint.config.mjs`) uses `eslint-config-next` (core-web-vitals + typescript) with standard ignores. Status: **UNVERIFIED**.

---

## 21. Known Issues

1. **No git repository** — no version control, no branch/commit history.
2. **Dependencies not installed** — no `node_modules`, no `package-lock.json`; cannot run tsc/build/lint or verify runtime.
3. **Root `src/app/page.tsx`** is the default Next.js starter page, not the anime homepage (real homepage is `src/app/(public)/page.tsx`).
4. **`src/app/sitemap.ts`** returns `null` — no dynamic sitemap.
5. **`PUT`/`DELETE /api/anime/[slug]`** lack `withAuth` authorization (inconsistent with `POST`).
6. **Ad click deduplication** — `/api/advertisements/click` uses `recordAdvertisementClick` (no dedup window) while a dedup-capable `recordClickIfUnique` exists in analytics lib but is unused.
7. **`isSafeDestination`** open-redirect guard exists but is not wired into `/go/[type]/[id]` page (direct `window.open(smartlinkUrl)`).
8. **Admin analytics page** — placeholder only, no Recharts charts rendered despite recharts being installed.
9. **No CSV export** for analytics (referenced in README).
10. **No watchlist API/UI** (model field exists only).
11. **No rate limiting** anywhere.
12. **`jwt as any`** and `(request as any).user` type escapes in auth lib.
13. **`JWT_SECRET`** defaults to `""` in config; auth lib throws if falsy (inconsistent).
14. **`src/hooks/` and `src/services/`** referenced in README do not exist.
15. **No deployment configuration** (vercel.json, Dockerfile, etc.).

---

## 22. Recommended Next Development Task

**Immediate:** Install dependencies and verify the build before writing new code.

1. `npm install` (to populate `node_modules` and generate `package-lock.json`).
2. `npx tsc --noEmit` (TypeScript check) — fix any type errors.
3. `npm run build` (Next.js production build) — fix any build errors.
4. `npm run lint` (ESLint) — fix lint errors.

**Then (development backlog):**
- Implement Recharts charts in admin analytics page + CSV export.
- Add `withAuth` to `PUT`/`DELETE /api/anime/[slug]`.
- Wire `isSafeDestination` into `/go/[type]/[id]` or replace direct smartlink open with validated redirect.
- Add rate limiting to auth and public API routes.
- Implement watchlist API/UI.
- Implement sitemap generation (`sitemap.ts`).
- Replace root starter `page.tsx` or remove route-group ambiguity.
- Add deployment configuration (vercel.json/Dockerfile) and env validation.

No development was performed in this audit; the above is a prioritized recommendation for the next session.

---

**End of audit report.** This document was created at `docs/ANIVERSE_PROJECT_STATUS_AUDIT_20261106.md`. No source files were modified, no dependencies installed, no builds run, and no commits made.