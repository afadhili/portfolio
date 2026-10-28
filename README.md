# AIFadh portfolio

Portfolio for Ahmad Isnainil Fadhili. React + TanStack Router + Vite, styled with the bento tokens in `DESIGN.md`.

## Run

```bash
bun install
bun run dev
```

## Live public GitHub data

The homepage fetches the public [@afadhili GitHub profile](https://github.com/afadhili) and all public repositories (with pagination) using `src/content/github-api.ts`. Recent public events are fetched separately when the GitHub activity card nears the viewport. Project names, descriptions when provided by GitHub, languages, stars, demo URLs, avatar, location, and counts update automatically. Known projects retain curated tags and fallback descriptions from their README. Successful results are cached in the visitor's browser for **1 hour**, rechecked while the page is open and when the tab regains focus; `src/content/github.ts` supplies the last verified snapshot if the API or network is unavailable. `src/components/useGithubActivity.ts` shares these results with the page. Case-study narratives and screenshots in `src/content/caseStudies.ts` remain hand-authored.

This still sends at least two public API requests from each visitor's browser when that visitor's cache expires, plus an events request if the activity card is reached (no token). A shared build-time or serverless cache would require a deployment integration; the static snapshot remains the offline fallback. GitHub applies unauthenticated rate limits, typically **60 requests per hour per IP**. Recent public events are **not** a complete contribution graph or private activity; the UI labels saved data if a refresh fails.

The Projects bento is a hand-curated composition of six public repositories. On phones the two featured projects become a swipeable row; smaller tiles stay in a two-column grid. The standalone article list is swipeable on phones as well. Bottom navigation and scroll progress are mobile-only; the Uses card can be expanded when needed. Edit names and tile sizes in `src/content/data.ts` (`pinnedProjects`); the GitHub API still supplies their live descriptions, stars, languages and demo URLs. Remaining repositories appear in the collapsible “All repositories” list, paginated six at a time. The two hand-authored case studies appear alongside articles on `/articles` and open the write-ups in `src/content/caseStudies.ts` (their routes remain `/projects/:slug`). The public `Relayz`, `SiJadwal`, and `ytm-v2` repositories were not found under this account, so they are not listed as GitHub projects here.

## Other content

- `src/content/links.ts`: contact email from local configuration (**not verified by the public GitHub API**), verified GitHub profile URL, and TODO LinkedIn and CV links.

- `src/content/uses.ts`: configured OS/distro, editor, terminal, shell, and theme; check that they still match your setup.
- `src/content/timeline.ts`: university information and TODO coursework, labs, achievements, date, and institution.
- `src/content/caseStudies.ts`: published repository details and real YT Music CLI screenshots; TODO personal outcomes and any TIF-IDE screenshots.
- `src/content/posts.ts` and `src/content/articles/`: three editable project-based articles. Each published entry has a Markdown file named after its slug; the standalone `/articles` page lists them all and links case studies, and `/articles/:slug` renders the Markdown. The homepage no longer has an articles section; articles remain accessible from the sidebar. Add personal lessons or real publication dates when you have them; no dates are shown until then.
- `index.html`: TODO replace `/og-placeholder.svg` with a hosted absolute PNG/WebP image URL when a domain is set.

The sidebar and command palette (Ctrl/Cmd+K) work across routes. The appearance picker offers AIFadh, Catppuccin, Gruvbox, Dracula, Nord, Kanagawa, Rosé Pine, and Tokyo Night. Dracula and Tokyo Night are dark-only; the sun/moon button changes mode for the others. Theme and mode persist separately in `theme-id` and `theme-mode`; the old `theme` mode setting is migrated. To add a palette, add an entry to `src/theme/themes.ts` and a CSS palette block (one per supported mode) in `src/styles/tokens.css`, then run `bun scripts/check-contrast.ts`. Reduced-motion preferences are respected.

## Verify

```bash
bun run lint
bunx tsc --noEmit
bun run build
```
