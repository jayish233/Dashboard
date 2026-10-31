# Presence — Gym Attendance, Member Engagement & Retention Platform

This repository implements **Presence**, a multi-tenant web application for gym attendance intelligence, member engagement, and owner retention operations, based on [`PRD.md`](./PRD.md) and the canonical visual/interaction design in [`Presence — Gym Retention Platform.html`](./Presence%20%E2%80%94%20Gym%20Retention%20Platform.html).

---

## 1. Commands & Development Workflow

- **Install dependencies:** `npm install`
- **Start local dev server:** `npm run dev`
- **Type-check & build for production:** `npm run build` (`tsc -b && vite build`)
- **Lint codebase:** `npm run lint`
- **Preview production build:** `npm run preview`

---

## 2. Current Scope & Data Integration Rules

- **Primary Build Scope:**
  1. **Access & Legal Site:** Sign In / Gym Registration / 6-Digit OTP Verification (`/signin` or `/`), Privacy Policy (`/privacy`), and Terms of Service (`/terms`).
  2. **Owner Dashboard (8 Screens):** Overview (`/owner/overview`), Attendance QR (`/owner/attendance`), Members (`/owner/members`), Retention Action Centre (`/owner/retention`), Inactive Members (`/owner/inactive`), Memberships (`/owner/memberships`), Analytics (`/owner/analytics`), and Gym Settings (`/owner/settings`).
- **JSON Data Architecture:**
  - All seed data, metrics, member lists, inactivity alerts, retention cohorts, settings, and legal copy live in [`src/data/presenceData.json`](./src/data/presenceData.json).
  - Data is provided to the UI via [`src/context/PresenceDataContext.tsx`](./src/context/PresenceDataContext.tsx) and typed in [`src/types/presence.ts`](./src/types/presence.ts).
  - Interactive actions in the Owner Dashboard (filtering, searching, pagination, adding follow-up notes, changing alert status or follow-up dates, toggling action completion, closing alerts, recording/undoing membership payments, inviting members/staff, and saving gym settings) mutate state initialized from `src/data/presenceData.json`.

---

## 3. Core PRD Business Rules

1. **Tenant Isolation & Access:** Every gym's data is isolated. Owners and authorized staff only see their own gym (`Iron Works Fitness`).
2. **Membership vs. Attendance Separation (FR-OWNER-004, FR-RET-010):**
   - Membership status (`Active`, `Expiring soon`, `Suspended`, `Expired`, `Archived`) is strictly separate from attendance activity.
   - A member can have an `Active` membership and still be absent/inactive.
   - Expired and suspended memberships must never be presented as unexplained active member absences in the Inactive Members list.
3. **Inactivity Threshold & Operating Days (FR-GYM-003, FR-GYM-004, FR-RET-002):**
   - Inactivity is measured in **eligible gym operating days** (default `10` opening days, configurable between `3` and `30`), not raw calendar days.
   - Configured weekly closed days (e.g., Sunday) and exceptional closure dates never count as absences and never break a streak.
4. **Dynamic QR Attendance (FR-QR-001 to FR-QR-011):**
   - Check-in uses a short-lived rotating QR code (`30`, `45`, or `60` seconds).
   - The UI must state clearly: *"Rotating codes stop old screenshots from working. They cannot stop someone sharing the live code."*
5. **Human-Initiated Follow-Up Only (FR-RET-012):**
   - Presence never sends automated promotional or marketing messages.
   - Each flagged member gets one suggested next step; the owner initiates contact manually (`Call` via `tel:` or `WhatsApp` via `https://wa.me/`) and logs notes/outcomes.
6. **Analytics Transparency (FR-ANALYTICS-005):**
   - Analytics must explicitly state: *"Returned means checked in again after an alert. It shows what happened after follow-up, not that follow-up caused it."*

---

## 4. Design System Specification (`Presence`)

Every screen in the application must adhere to the exact rules defined in the `Design System` board of `Presence — Gym Retention Platform.html`.

### 4.1 Core Principles
1. **Group with hairlines and space, not cards:** Use `1px solid var(--line)` top/bottom borders and whitespace instead of card grids. Use at most **one** tinted panel (`background: rgba(34,40,49,0.045)`, `border-radius: 16px`, `padding: 24px`) per screen for secondary detail/follow-up drawers.
2. **Ink is the default; Teal is the single key action:** Use `--ink` (`#222831`) for primary buttons and dark surfaces. Use `--teal` (`#00ADB5`) for presence/active indicators and at most **one** key action button per screen.
3. **Say only what matters:** Concise, plain-English copy. Keep unknown legal/address facts as visible `[PLACEHOLDERS]` (`[RETENTION PERIOD]`, `[CONTACT EMAIL]`, `[LIABILITY CLAUSE]`, `[GOVERNING LAW / JURISDICTION]`, `[GYM ADDRESS]`).
4. **Large, quiet numbers & monospace metadata:** Display figures at `38px`. Use `Geist Mono` for all dates, times, counts, durations, and OTP digits.
5. **Accessible controls & no red/green:** Every interactive control is at least `44px` tall (`44px` toolbars/chips, `52px` form inputs/buttons) and keyboard accessible with a `2px solid #00747A` focus ring. Status is **always** a dot plus a word—never color alone, and never red or green.

### 4.2 Color Tokens
| Token | Value | Role |
| :--- | :--- | :--- |
| `--ink` | `#222831` | Primary text, owner sidebar background, default primary button, QR display panel |
| `--graphite` | `#393E46` | Long-form legal text, primary button hover, avatar badge on dark surfaces |
| `--teal` | `#00ADB5` | Present/active status dot, single key action button fill (`#222831` text), chart line & latest bar |
| `--deep` | `#00747A` | Derived deep teal for text links, highlighted figures on light surfaces, and `2px` focus rings |
| `--mist` | `#EEEEEE` | Application background ground and text on `--ink` surfaces |
| `--muted` | `#5A616B` | Secondary text, captions, table headers, chart axis labels |
| `--paper` | `#FFFFFF` | Owner working sheet (`border-radius: 20px`), form inputs, active segmented pills |
| `--line` | `rgba(34,40,49,0.12)` | Hairline dividers and input borders (`0.14` on Sign-in and Legal screens) |

*Contrast ban:* Never use `--teal` as text on light backgrounds, and never use white (`#FFFFFF`) text on `--teal` (`2.7 : 1` fails contrast). Always use `--ink` (`#222831`) text on `--teal`.

### 4.3 Status Dot Markers
Status is always rendered as a `10px` (or `8px`) circle dot paired with a text label:
- **Present / Active / Contacted / Returned:** `background: #00ADB5`
- **Contact pending / Needs action / No visit in 10+ days:** `background: #222831`
- **Interested:** `background: #00747A`
- **Expiring soon / Expires soon:** `background: #FFFFFF; box-shadow: inset 0 0 0 2px #00747A`
- **Attendance dropped:** `background: #FFFFFF; box-shadow: inset 0 0 0 2px #00ADB5`
- **Suspended / Not interested / Away (own request):** `background: #5A616B`
- **Expired / Membership issue / Resolved / Closed:** `background: #FFFFFF; box-shadow: inset 0 0 0 2px #222831` (or `inset 0 0 0 2px #00ADB5` for Resolved in Inactive Members)

### 4.4 Typography
- **Font Families:**
  - Sans: `'Geist', system-ui, -apple-system, sans-serif` (weights `400`, `500`, `600` only)
  - Mono: `'Geist Mono', ui-monospace, monospace` (weights `400`, `500` only)
- **Type Scale:**
  - **Display (Legal / Design System):** `48px–56px`, line-height `1.05`, weight `600`, letter-spacing `-0.03em`
  - **Figure (KPIs):** `38px`, line-height `1`, weight `500`, letter-spacing `-0.035em`
  - **Page Title (Owner):** `30px`, line-height `1.1`, weight `600`, letter-spacing `-0.025em`
  - **Subsection / Panel Title:** `22px`, weight `600`, letter-spacing `-0.02em`
  - **Section Heading:** `17px`, line-height `1.3`, weight `600`, letter-spacing `-0.01em`
  - **Body / Input Text:** `15px–16px`, line-height `1.5`, weight `400` (`16px` on inputs so mobile browsers do not zoom)
  - **Row Primary Text:** `15px`, weight `500`
  - **Label:** `13px`, line-height `1.4`, weight `500`
  - **Caption:** `12px–13px`, line-height `1.5`, weight `400`, color `--muted`
  - **Mono Metadata:** `Geist Mono`, `12px–14px`

### 4.5 Layout, Spacing & Motion
- **Spacing tokens:** `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `40px`, `48px`.
- **Border radii:** `9px` (segmented option), `10px` (sidebar nav item), `12px` (inputs, buttons), `13px` (segmented group container), `16px` (secondary panel, QR frame), `20px` (owner working sheet), `999px` (filter chips).
- **Owner Shell Layout:**
  - Outer flex container on `--mist` (`min-height: 100vh`).
  - Left `<aside>`: `flex: 1 1 248px`, `background: var(--ink)`, `color: var(--mist)`, `padding: 28px 20px`, containing `Presence` brand mark, 7 nav items (`height: 44px`, `border-radius: 10px`, active item `background: rgba(0,173,181,0.18)` with `#00ADB5` icon), and bottom owner profile (`AM` avatar in `--graphite`, `Aarav Mehta`, `Iron Works Fitness`).
  - Right `<main>`: `flex: 999 1 640px`, `padding: 24px`, housing the white working sheet (`background: #FFFFFF`, `border-radius: 20px`, `padding: 32px`).
- **Motion:**
  - Button/row hover: `150ms ease-out` (`.btn-ink:hover` -> `#393E46`, `.btn-teal:hover` -> `inset 0 0 0 999px rgba(255,255,255,0.14)`, `.btn-line:hover` -> `rgba(34,40,49,0.06)`, `.row:hover` -> `rgba(34,40,49,0.04)`).
  - Button active press: `transform: scale(0.98)` in `100ms ease-out`.
  - QR progress bar: `width 1s linear`.
  - Respect `@media (prefers-reduced-motion: reduce)` by disabling all transitions and animations.

---

## 5. Application Routes & Screen Specifications

### 5.1 Access & Legal Routes
1. **`/` and `/signin` — Sign In, Create Gym & OTP Verification (`src/pages/SignInPage.tsx`)**
   - Split layout: Left dark `--ink` brand panel with `Presence` logo, 14x6 deterministic teal/mist dot matrix (`84` dots), and `40px` heading *"See who is drifting before they leave."*
   - Right `--mist` form panel:
     - Top-right mode toggle button (*"New gym? Create account"* / *"Have an account? Sign in"*) when role is `Gym owner`.
     - Segmented role switcher (`Gym owner` / `Member`).
     - **Sign In mode:** Email input + *"Send code"* `--ink` button.
     - **Register mode (Owner):** `Your name`, `Gym name`, `Email`, `Phone` inputs + *"Send verification code"* `--ink` button.
     - **Code verification step:** 6 `Geist Mono` single-digit inputs (`height: 56px`, `font-size: 22px`), *"Verify and continue"* `--teal` button (navigates to `/owner/overview`), and *"Use a different email"* link.
     - Footer agreement line linking to `/terms` and `/privacy`.
2. **`/privacy` — Privacy Policy (`src/pages/PrivacyPage.tsx`)**
   - Centered `1040px` max-width layout on `--mist` with `Presence` header, `Privacy` / `Terms` nav, `48px` title, *"Last updated 30 October 2026 · Draft for legal review"*, 6 hairline-divided sections (*What we collect*, *What we do not collect*, *Who can see it*, *How we use it*, *Keeping and deleting data*, *Security*), and *"Back to sign in"* link.
3. **`/terms` — Terms of Service (`src/pages/TermsPage.tsx`)**
   - Centered `1040px` max-width layout on `--mist` with `Presence` header, `Privacy` / `Terms` nav, `48px` title, *"Last updated 30 October 2026 · Draft for legal review"*, 6 hairline-divided sections (*Accounts*, *Attendance*, *Gym owner duties*, *What the service is not*, *Changes and suspension*, *Liability and law*), and *"Back to sign in"* link.

### 5.2 Owner Dashboard Routes
1. **`/owner/overview` — Overview (`src/pages/OwnerOverviewPage.tsx`)**
   - Header: `Overview`, subtitle `"Friday, 30 October"`, and `Show QR` `--teal` button linking to `/owner/attendance`.
   - 6 Key Figures: `Active memberships` (`371`), `Checked in today` (`143`), `Expiring in 14 days` (`23`), `Attendance dropping` (`9`), `No visit in 10+ days` (`17`), `Re-engaged this month` (`12` with `2px solid #00ADB5` top border and `#00747A` numeral).
   - `Daily check-ins` SVG area/line chart with `7D`, `30D`, `90D` range selector.
   - 3 Bottom Columns: `Attendance dropping` (links to `/owner/retention`), `No visit in 10+ days` (links to `/owner/retention`), `Expiring soon` (links to `/owner/memberships`).
2. **`/owner/attendance` — Attendance QR (`src/pages/OwnerAttendancePage.tsx`)**
   - Left `--ink` panel (`border-radius: 20px`, `padding: 32px`): 25x25 deterministic SVG QR matrix with 3 finder patterns, `Live` teal dot indicator, `"New code in Xs"` countdown in `Geist Mono`, 30s progress bar, and screenshot disclaimer.
   - Right column: `Checked in today` (`143`) with scrollable list of today's member check-ins and timestamps.
3. **`/owner/members` — Members (`src/pages/OwnerMembersPage.tsx`)**
   - Header: `Members`, `"412 registered"`, `Add member` / `Close` button.
   - Collapsible `Add member` form drawer (`Name`, `Phone`, `Email`, `Starts`, `Expires`, `"Send invitation"` `--teal` button, and *"The member gets an email link that expires in 7 days."*).
   - Filter chips (`All 412`, `Active 371`, `Expiring 23`, `Suspended 6`, `Expired 18`) + search input (`Search name or phone`).
   - 4-column hairline table (`Member`, `Expires`, `Last visit`, `Membership`) + pagination controls (`1–10 of 412` / `11–20 of 412`, `Previous`, `Next`).
4. **`/owner/retention` — Retention Action Centre (`src/pages/OwnerRetentionPage.tsx`)**
   - Header: `Retention`, subtitle *"Who may leave, and what to do next. You decide. Nothing is sent automatically."*, link *"All 17 inactive members"* to `/owner/inactive`.
   - Situation filter chips: `All`, `No visit in 10+ days`, `Attendance dropped`, `Expires soon`, `Away`, `Returned` with dynamic open counts.
   - Left list of flagged members (most urgent first) + right `Next action` drawer with 8-week visits SVG bar chart, suggested next step button (`Contact member`, `Check in with member`, `Send renewal reminder`, `Follow up on their date`, `Close alert` / `Done · tap to undo`), `Call` & `WhatsApp` buttons, `Follow up on` date picker, timestamped `Notes` form/history, and `Close this alert` button.
5. **`/owner/inactive` — Inactive Members (`src/pages/OwnerInactivePage.tsx`)**
   - Header: `Inactive members`, subtitle *"Alerts open after 10 operating days without a visit. Expired and suspended memberships are listed elsewhere."*
   - Status filter chips: `All`, `Contact pending`, `Contacted`, `Interested`, `Membership issue`.
   - Left scrollable list of 17 inactive members + right `Follow-up` drawer with member contact info, `Call` & `WhatsApp` buttons, 6 status pills (`Contact pending`, `Contacted`, `Interested`, `Membership issue`, `Not interested`, `Resolved`), `Next follow-up` date input, and `Notes` form/history.
6. **`/owner/memberships` — Memberships (`src/pages/OwnerMembershipsPage.tsx`)**
   - Header: `Memberships`, subtitle *"Membership status is separate from attendance. A member can be active and still absent."*
   - 5 Totals: `Active` (`371`), `Expiring in 14 days` (`23`), `Expired` (`18`), `Suspended` (`6`), `Archived` (`17`).
   - 3 Segmented Tabs: `Expiring in 14 days · 23`, `Expired · 18`, `Suspended · 6`.
   - 5-column table (`Member`, `Started`, `Ends`, `Days left` / `Expired` / `Resumes`, `Payment`) with interactive `Record payment` / `Undo` button (`Paid ₹12,000 · 30 Oct`).
7. **`/owner/analytics` — Analytics (`src/pages/OwnerAnalyticsPage.tsx`)**
   - Header with `4W`, `13W`, `1Y` range selector and dynamic period subtitle.
   - `October, so far` 5-figure summary (`Became inactive 38`, `Contacted 31`, `Returned 12`, `Memberships expired 18`, `Days from alert to first follow-up 2`) + causal disclaimer.
   - `Average daily check-ins, by week` SVG area/line chart.
   - Bottom 2-column grid: `Open inactivity alerts` SVG bar chart and `Attendance declining, by group` progress bars (`Evening batch, 5 to 9 PM`, `Joined in the last 60 days`, `3-month plan`, `Morning batch, 6 to 9 AM`).
8. **`/owner/settings` — Gym Settings (`src/pages/OwnerSettingsPage.tsx`)**
   - 5 hairline-divided sections: `Profile` (`Gym name`, `Phone`, `Time zone`, `Address`), `Opening days` (`Mon`–`Sun` toggles + closure date manager), `Inactivity alert` (`−` / `+` stepper for opening days), `QR code lifetime` (`30 sec`, `45 sec`, `60 sec`), and `Staff` (`Neha Rao`, `Imran Sheikh`, plus `Invite staff` form).
   - Footer `Save changes` button with confirmation status message.

---

## 6. JSON Data Structure (`src/data/presenceData.json`)

All application data must follow the top-level keys in `src/data/presenceData.json`:
- `gym`: `{ name, ownerName, ownerInitials, phone, timezone, timezones, address, currentDateLabel, openDays, closures, inactivityThreshold, qrLifetime }`
- `overview`: `{ stats, checkInSeries, rangeLabels, dropping, followups, expiring }`
- `attendance`: `{ checkedInCount, qrCycleSeconds, initialSecondsRemaining, initialSeed, recentCheckIns }`
- `members`: `{ totalRegistered, statusCounts, pages }`
- `retention`: `{ categoryTotals, situations, items }`
- `inactiveMembers`: `{ statusMeta, members }`
- `memberships`: `{ totals, groupCounts, groups }`
- `analytics`: `{ octoberStats, ranges, decliningGroups }`
- `staff`: `[ { id, name, permissions, status } ]`
- `legal`: `{ lastUpdated, privacySections, termsSections }`
