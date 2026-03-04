# CTRL + SHIFT Site

## Run locally

Prerequisites: Node.js 20+

1. Install dependencies:
   `npm install`
2. Set required env vars in your shell or `.env`:
   - `SPONSOR_PORTAL_PASSWORD` for `/sponsors` access
   - `GEMINI_API_KEY` only if you still use Gemini-powered features in the main site
3. Start dev server:
   `npm run dev`

The app runs through the local Express server at `http://localhost:3000`.

## Sponsor portal routes

- `/sponsors/login`
- `/sponsors`
- `/sponsors/vol-9`

Auth behavior:
- Shared password check against `SPONSOR_PORTAL_PASSWORD`
- Successful login sets `sponsor_auth=1` as an `httpOnly` cookie for 7 days
- All `/sponsors/*` routes redirect to `/sponsors/login` when not authenticated
- Log out clears the cookie

## Volume 9 data files

Source files live in:
- `/Users/joshmaldonado/Desktop/git-projects/ctrlshiftsite/public/sponsors/vol-9/guests.csv`
- `/Users/joshmaldonado/Desktop/git-projects/ctrlshiftsite/public/sponsors/vol-9/budget.xlsx`
- `/Users/joshmaldonado/Desktop/git-projects/ctrlshiftsite/public/sponsors/vol-9/agenda.pdf`

Generated report data:
- `/Users/joshmaldonado/Desktop/git-projects/ctrlshiftsite/public/sponsors/vol-9/report-data.json`

Data generator script:
- `scripts/generate-sponsor-data.mjs`

The generator runs automatically on `npm run dev` and `npm run build`.

### Build-time metrics generated

From CSV:
- total records
- approved count
- checked-in count
- show rate (`checked-in / approved`)
- role distribution
- interests distribution
- tools distribution
- attendee table payload (no email or phone)
- sponsor-safe CRM highlights

From XLSX:
- total revenue
- total expenses
- net P&L
- expense breakdown by category
- expense line items table

If XLSX parsing fails, fallback summary is loaded from:
- `/Users/joshmaldonado/Desktop/git-projects/ctrlshiftsite/src/data/sponsors/vol9-budget-fallback.json`

## Add a new report (Volume 10+)

1. Create a new folder in `public/sponsors`, for example `public/sponsors/vol-10`.
2. Add `guests.csv`, `budget.xlsx` and `agenda.pdf` for that volume.
3. Extend `scripts/generate-sponsor-data.mjs` with a `vol-10` config and output target.
4. Add a new route page (for example `/sponsors/vol-10`) under `src/sponsors/pages`.
5. Add a new card link on `/sponsors` in `src/sponsors/pages/SponsorsLandingPage.tsx`.
6. Rebuild with `npm run build` and verify generated JSON output for the new volume.

## Production run

Build and run the Node server:

1. `npm run build`
2. `SPONSOR_PORTAL_PASSWORD="your-shared-password" npm run start`

This serves `dist` through `server/server.mjs`, including sponsor auth endpoints and route protection.
