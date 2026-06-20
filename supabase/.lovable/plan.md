# জাবি পথ — Build Plan

An accessible bilingual (বাংলা/English) campus navigation web app for Jahangirnagar University students with disabilities. Mobile-first, WCAG 2.1 AA, dark mode, voice guidance.

## Phased Scope

**Phase 1 (this build)** — Foundation
- Bilingual UI shell (বাংলা ↔ English toggle, persisted)
- Lovable Cloud auth (email/password + Google), with disability-profile onboarding
- Database schema + sample JU data (~12 buildings, paths, ramps, elevators)
- Interactive custom SVG map of JU campus with accessibility filters
- Accessible shortest-path routing (Dijkstra) between two selected nodes, respecting wheelchair/visual/hearing/cognitive profile
- Step-by-step direction panel (bottom sheet on mobile, sidebar on desktop)
- Dark mode, high-contrast tokens, large tap targets, ARIA labels, keyboard nav

**Phase 2** — Voice + Reports
- Web Speech API turn-by-turn voice (bn-BD / en-US, follows UI language)
- Report-an-issue flow (broken elevator, blocked ramp) tied to a node
- Live "out of service" indicators on map

**Phase 3** — Admin + Analytics
- `user_roles` table + `has_role` security definer + admin route
- Admin moderation page (review/resolve/close reports, toggle node status)
- PostHog integration (route searches, filter clicks, voice toggles, reports)

## Design

Before coding Phase 1, I'll generate 3 visual design directions (bilingual layout, accessibility-first composition, calm/high-contrast palette) and let you pick one. The pick will lock palette, typography, and layout for the whole app.

## Disability Profiles (all 4 supported)

| Profile | Routing impact | UI impact |
|---|---|---|
| Wheelchair / mobility | Exclude stair edges; require ramp/elevator | Larger tap targets, simplified map |
| Visually impaired | Prefer well-lit known paths; verbose landmark cues | Voice-first (Phase 2), high contrast, screen-reader labels |
| Hearing impaired | No routing change | Visual cues + vibration prompts instead of sound |
| Cognitive | Prefer simpler routes (fewer turns) | Plain-language step instructions, fewer simultaneous options |

## Technical Details

**Stack:** TanStack Start + React + Tailwind + shadcn (project default). Lovable Cloud (Supabase under the hood) for auth + DB. No Firebase.

**Routes**
- `/` — landing/home with language toggle and Get Started
- `/auth` — sign in / sign up (email/password + Google via Lovable broker)
- `/onboarding` — pick disability profile + preferences (under `_authenticated/`)
- `/map` — main navigation map (under `_authenticated/`)
- `/profile` — edit profile + preferences (under `_authenticated/`)

**Phase 1 DB schema** (migration with explicit GRANTs + RLS):
- `profiles` (id → auth.users, full_name, disability_type enum, voice_enabled, language)
- `nodes` (id, name_bn, name_en, type enum: building|elevator|ramp|path|intersection, x, y, accessible bool, notes)
- `edges` (id, from_node, to_node, distance, is_accessible, has_stairs, has_ramp, has_elevator, surface)
- Auto-create profile trigger on signup
- RLS: users read/update own profile; nodes/edges world-readable to authenticated

(Phase 3 adds `app_role` enum, `user_roles`, `has_role()`, `reports` table.)

**Routing algorithm:** Dijkstra in client TypeScript over edges fetched once per session via a `createServerFn`. Profile-based edge filter applied before search.

**Map:** Hand-authored SVG (`src/assets/ju-campus.svg`) layered with React-rendered node markers and route polyline. Pinch-zoom + pan via simple transform state. No Mapbox token needed.

**Bilingual:** Lightweight in-app i18n (`src/lib/i18n.ts`) with `bn`/`en` dictionaries; node names stored bilingual in DB.

**Voice (Phase 2):** `window.speechSynthesis` with `bn-BD` fallback to `en-US` if unavailable.

## Out of Scope (Phase 1)
Voice TTS, reports CRUD, admin role, PostHog, real-time elevator status. These are queued for Phase 2/3.

## Deliverable at end of Phase 1
You'll be able to: sign up → pick disability profile → see the JU map → tap two points → see a profile-appropriate accessible route drawn with step-by-step directions, all in বাংলা or English with dark mode.

After you approve, I'll start by generating 3 design directions for you to choose from.
