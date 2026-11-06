# Design Document — AniVerse

## Brand Identity

- **Brand Name:** AniVerse
- **Tagline:** Your Universe of Anime
- **Primary Color:** Purple/Violet (#6366f1 - violet-500/600)
- **Secondary Color:** Blue
- **Background:** Dark (#080B12)
- **Surface:** Slightly lighter dark (#0C111D)
- **Typography:** Inter (sans-serif), clean and modern

## Design Direction

- Dark background with purple/violet primary accents
- Blue secondary accents
- Modern, premium anime streaming aesthetic
- Smooth animations and transitions (subtle, not distracting)
- Attractive anime cards with hover effects
- Clean layouts with consistent spacing
- Responsive design (mobile-first)
- Dark mode as default

## Layout Structure

### Desktop
- Top navigation (sticky)
- Hero banner
- Main content sections with multi-column anime cards
- Professional footer

### Mobile
- Responsive navigation (hamburger menu)
- Mobile-friendly search
- Optimized anime cards (2 columns)
- Touch-friendly controls
- Responsive video player

## Pages

1. **Homepage** — Hero banner, featured, trending, popular, recently updated, latest episodes, latest releases, recommended, genre categories, recently added, footer
2. **Anime Discovery** — Browse, search, filter by genre/year/status/type, sort, pagination
3. **Anime Details** — Poster, banner, synopsis, genres, studio, watch button, episode list, related anime
4. **Watch** — Video player, multiple servers, quality selection, subtitles, playback controls, season/episode selector
5. **Download** — Download buttons, multiple servers, quality selection, file size, download history

## Components

- Base UI: Button, Card, Input, Label, Select, Badge, Avatar, Skeleton, Dialog, Toaster, Table
- Layout: Navbar, Footer, AdminLayout (sidebar + top nav)
- Anime: AnimeCard, AnimeSkeleton
- Player: VideoPlayer (HLS.js + HTML5)
- Download: Download cards, quality selectors

## Accessibility

- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation
- Focus visible states
- Color contrast ratios
