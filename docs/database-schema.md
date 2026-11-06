# Database Schema — AniVerse

All models use Mongoose with timestamps, schema validation, and appropriate indexes.

## 1. User
- name, email (unique), password (hashed), avatar
- role: USER | ADMIN | SUPER_ADMIN
- isActive, isEmailVerified
- emailVerificationToken/Expires, passwordResetToken/Expires
- lastLoginAt
- watchlist (ref Anime), favorites (ref Anime)
- Indexes: email (unique), role

## 2. Genre
- name, slug (unique), description
- Indexes: slug (unique), name

## 3. Anime
- title (text index), alternativeTitles[], slug (unique)
- synopsis, genres (ref Genre), releaseYear
- status: UPCOMING | ONGOING | COMPLETED | CANCELLED
- rating (0-10), type: TV | MOVIE | OVA | ONA | SPECIAL
- studio, totalEpisodes, totalSeasons
- posterUrl, bannerUrl, featured
- seoTitle, seoDescription
- Indexes: slug (unique), status+releaseYear, featured+createdAt, rating, text title

## 4. Season
- anime (ref Anime), seasonNumber, title, description
- Indexes: anime+seasonNumber (unique)

## 5. Episode
- anime (ref Anime), season (ref Season), episodeNumber, slug (unique)
- title, description, duration, thumbnailUrl
- subtitles[], videoSources[], downloadSources[]
- totalViews, totalDownloads, isPublished
- Indexes: anime+episodeNumber, slug (unique), isPublished

### VideoSource / DownloadSource (embedded)
- serverName, serverPriority, qualities[{quality, url, fileSize, isHls}], isEnabled

## 6. VideoSource (standalone)
- name, url, isActive

## 7. DownloadSource (standalone)
- name, url, isActive

## 8. WatchHistory
- user (ref User), anime (ref Anime), episode (ref Episode)
- watchedAt, progress, completed
- Indexes: user+watchedAt, user+anime+episode

## 9. Favorite
- user (ref User), anime (ref Anime)
- Indexes: user+anime (unique)

## 10. Advertisement
- name, smartlinkUrl, placementType, campaignName
- priority, isEnabled, animeId (ref), episodeId (ref)
- totalClicks
- Indexes: placementType+isEnabled+priority, animeId+placementType, episodeId+placementType

## 11. AdvertisementClick
- advertisement (ref Advertisement), placementType
- animeId (ref), episodeId (ref), userId (ref)
- ipAddress, userAgent, clickedAt
- Indexes: clickedAt, advertisement+clickedAt, placementType+clickedAt

## 12. StreamingActivity
- userId (ref User), anime (ref Anime), episode (ref Episode)
- server, quality, playedAt, durationWatched
- Indexes: playedAt, anime+playedAt, episode+playedAt

## 13. DownloadActivity
- userId (ref User), anime (ref Anime), episode (ref Episode)
- server, quality, downloadedAt, fileSize, completed
- Indexes: downloadedAt, anime+downloadedAt, episode+downloadedAt

## 14. SiteSettings
- siteName, tagline, logoUrl, faviconUrl, description
- seoTitle, seoDescription, socialLinks (Map)
- storageProvider: R2 | S3 | NONE
- advertisingEnabled, homepageSections[]
- Indexes: updatedAt

## 15. ActivityLog
- userId (ref User), action, entity, entityId, metadata, ipAddress
- Indexes: createdAt, userId+createdAt, action

## Relationships

- User → WatchHistory, Favorite, ActivityLog (1:many)
- Anime → Season, Episode, WatchHistory, Favorite, StreamingActivity, DownloadActivity (1:many)
- Genre → Anime (1:many)
- Season → Episode (1:many)
- Episode → WatchHistory, StreamingActivity, DownloadActivity (1:many)
- Advertisement → AdvertisementClick (1:many)

## Data Safety

- Large video files are NOT stored in MongoDB
- Videos stored in R2/S3 with references (URLs) in the database
- Images stored in Cloudinary with references in the database
- Connection cached globally to prevent exhaust during hot reloads
